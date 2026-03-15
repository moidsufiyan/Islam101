import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ShieldCheck, Sparkles, Copy, Check, AlertCircle } from 'lucide-react';
import { chatAPI } from '../utils/api';

const BASE_SYSTEM_PROMPT = `You are "Hujra Assistant", an Islamic scholar and spiritual guide built into the Islam101 app.

STRICT RULES:
1. You ONLY answer questions related to Islam, Islamic faith, Quran, Hadith, Sunnah, Fiqh, Islamic history, Muslim daily life, spirituality, dua, prayer, fasting, zakat, hajj, and matters that a Muslim might seek Islamic guidance on.
2. If the user asks about anything NOT related to Islam (e.g., coding, math, sports, politics unrelated to Islam, entertainment, etc.), you MUST politely decline and redirect them to ask an Islamic question instead. Say something like: "I'm here to help with Islamic questions. Could you ask me something about faith, prayer, Quran, or Islamic life?"
3. Always cite Quran verses and authentic Hadith when possible. Format citations clearly.
4. Be respectful of all schools of thought (Hanafi, Shafi'i, Maliki, Hanbali, and others). When there is a difference of opinion, mention it briefly.
5. Keep answers concise but informative. Use a warm, approachable tone.
6. Never make up hadith or Quran references. If unsure, say so.
7. Use "ﷺ" after mentioning the Prophet Muhammad.
8. Structure longer answers with clear sections when appropriate.`;

const TONE_PROMPTS = {
    sister: `\n\nADDITIONAL TONE: Respond in a gentle, nurturing, motherly tone — like a caring older sister or mother figure in the Muslim community. Use warm, encouraging language. Be extra compassionate and reassuring. Use phrases like "dear one", "may Allah ease your heart", etc.`,
    brother: `\n\nADDITIONAL TONE: Respond in a direct, motivating, brotherly tone — like a knowledgeable elder brother or mentor. Be practical and action-oriented. Use encouraging but firm language. Motivate the user to take concrete steps.`
};

const springTransition = { type: 'tween', duration: 0.25, ease: 'easeOut' };

const Hujra = () => {
    const [tone, setTone] = useState('brother');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [inputVal, setInputVal] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const [error, setError] = useState(null);
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);
    const conversationRef = useRef([]);
    const abortControllerRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Cleanup: abort any in-flight request when the component unmounts
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, []);

    const buildMessagesPayload = (userMessage) => {
        const systemPrompt = BASE_SYSTEM_PROMPT + (TONE_PROMPTS[tone] || TONE_PROMPTS.brother);

        const msgs = [
            { role: 'system', content: systemPrompt }
        ];

        for (const msg of conversationRef.current) {
            msgs.push({
                role: msg.role === 'model' ? 'assistant' : msg.role,
                content: msg.text
            });
        }

        msgs.push({ role: 'user', content: userMessage });

        return msgs;
    };

    const fetchAIResponse = async (userMessage) => {
        setIsTyping(true);
        setError(null);

        // Cancel any ongoing request before starting a new one
        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();

        const assistantMsgId = Date.now();

        try {
            const messagesPayload = buildMessagesPayload(userMessage);

            // Calls YOUR backend at /api/chat — API key stays on the server!
            const res = await chatAPI.sendMessage(messagesPayload, abortControllerRef.current.signal);

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData?.message || errData?.error?.message || `API error: ${res.status}`);
            }

            setMessages(prev => [...prev, {
                id: assistantMsgId,
                sender: 'assistant',
                text: '',
            }]);

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let fullText = '';
            let displayedText = '';
            let buffer = '';
            const charQueue = [];
            let streamDone = false;

            const typewriterPromise = new Promise((resolve) => {
                const interval = setInterval(() => {
                    if (charQueue.length > 0) {
                        const charsToShow = Math.min(2, charQueue.length);
                        for (let i = 0; i < charsToShow; i++) {
                            displayedText += charQueue.shift();
                        }
                        const currentText = displayedText;
                        setMessages(prev =>
                            prev.map(msg =>
                                msg.id === assistantMsgId
                                    ? { ...msg, text: currentText }
                                    : msg
                            )
                        );
                    } else if (streamDone) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 20);
            });

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || !trimmed.startsWith('data: ')) continue;

                    const data = trimmed.slice(6);
                    if (data === '[DONE]') break;

                    try {
                        const parsed = JSON.parse(data);
                        const token = parsed?.choices?.[0]?.delta?.content;
                        if (token) {
                            fullText += token;
                            for (const ch of token) {
                                charQueue.push(ch);
                            }
                        }
                    } catch {
                    }
                }
            }

            streamDone = true;
            await typewriterPromise;

            if (!fullText) {
                throw new Error('Empty response from the server.');
            }

            conversationRef.current.push({ role: 'user', text: userMessage });
            conversationRef.current.push({ role: 'model', text: fullText });

            if (conversationRef.current.length > 20) {
                conversationRef.current = conversationRef.current.slice(-16);
            }
        } catch (err) {
            console.error('Groq API Error:', err);
            setError(err.message);
            setMessages(prev => {
                const filtered = prev.filter(msg => msg.id !== assistantMsgId || msg.text);
                return [...filtered, {
                    id: Date.now(),
                    sender: 'error',
                    text: err.message,
                }];
            });
        } finally {
            setIsTyping(false);
        }
    };

    const handleSend = () => {
        const text = inputVal.trim();
        if (!text || isTyping) return;
        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
        setInputVal('');
        fetchAIResponse(text);
    };

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="h-[100dvh] flex flex-col relative overflow-hidden bg-[#050B14]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-teal-500/[0.04] rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[80px] pointer-events-none" />

            <header className="glass border-b border-white/[0.04] sticky top-0 z-20 px-5 pt-8 pb-4 shadow-sm relative">
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-500/20 to-transparent" />
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.15)] relative">
                            <ShieldCheck className="w-5 h-5 text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                            <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 rounded-full border border-black shadow-[0_0_5px_rgba(52,211,153,0.8)] animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                Digital Hujra
                            </h1>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 opacity-80">
                                SECURE • PRIVATE • GUIDED
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-black/30 p-1 rounded-xl flex relative border border-white/5 backdrop-blur-md">
                    <button
                        onClick={() => setTone('sister')}
                        className={`flex-1 relative text-xs font-bold uppercase tracking-widest py-2.5 rounded-lg z-10 transition-colors ${tone === 'sister' ? 'text-white drop-shadow-md' : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        🤲 Motherly Tone
                    </button>
                    <button
                        onClick={() => setTone('brother')}
                        className={`flex-1 relative text-xs font-bold uppercase tracking-widest py-2.5 rounded-lg z-10 transition-colors ${tone === 'brother' ? 'text-white drop-shadow-md' : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        💪 Brother's Mode
                    </button>
                    <motion.div
                        className="absolute top-1 bottom-1 w-[calc(50%-0.25rem)] bg-white/10 rounded-lg z-0 border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.05)]"
                        animate={{ left: tone === 'sister' ? '0.25rem' : 'calc(50%)' }}
                        transition={springTransition}
                    />
                </div>
            </header>

            <main className="flex-1 overflow-y-auto px-4 py-6 pb-4 space-y-6 hide-scrollbar z-10 relative">
                {messages.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={springTransition}
                        className="text-center py-10 mb-4 glass-premium rounded-[2rem] border border-white/5 mx-2"
                    >
                        <div className="inline-flex items-center gap-2 bg-teal-500/10 text-teal-400 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4 border border-teal-500/20 shadow-inner">
                            <Sparkles className="w-3.5 h-3.5" />
                            Islamic Guidance
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-[260px] mx-auto font-medium">
                            Ask any question about Islam, faith, prayer, Quran, or daily Muslim life.<br />
                            <span className="text-teal-400/80 font-semibold mt-1.5 block">Powered by AI • Islam only.</span>
                        </p>
                    </motion.div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={springTransition}
                            className={`flex flex-col max-w-[90%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                                }`}
                        >
                            {msg.sender === 'assistant' && (
                                <div className="flex items-center gap-2 mb-2 px-1">
                                    <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/40 shadow-[0_0_8px_rgba(20,184,166,0.2)]">
                                        <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                                    </div>
                                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Hujra Assistant</span>
                                </div>
                            )}

                            {msg.sender === 'error' && (
                                <div className="flex items-center gap-2 mb-2 px-1">
                                    <AlertCircle className="w-4 h-4 text-rose-400" />
                                    <span className="text-[11px] text-rose-400 font-bold uppercase tracking-wider">Error</span>
                                </div>
                            )}

                            <div className={`rounded-3xl p-5 relative overflow-hidden ${msg.sender === 'user'
                                ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-tr-sm shadow-[0_10px_20px_rgba(20,184,166,0.25)] border-t border-teal-400/40 border-l border-teal-400/20'
                                : msg.sender === 'error'
                                    ? 'bg-rose-500/10 border border-rose-500/20 rounded-tl-sm'
                                    : 'glass-premium rounded-tl-sm border border-white/[0.08] shadow-lg'
                                }`}>

                                {msg.sender === 'user' ? (
                                    <p className="text-[15px] font-medium leading-relaxed relative z-10 drop-shadow-sm">{msg.text}</p>
                                ) : msg.sender === 'error' ? (
                                    <p className="text-sm text-rose-300 leading-relaxed font-medium">{msg.text}</p>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-sm text-slate-200 leading-relaxed font-medium whitespace-pre-wrap">
                                            {msg.text}
                                        </p>

                                        <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04] mt-2">
                                            <button
                                                onClick={() => handleCopy(msg.text, msg.id)}
                                                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors bg-black/20 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/5 active:scale-95"
                                            >
                                                {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                                {copiedId === msg.id ? 'Copied' : 'Copy'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                            className="mr-auto"
                        >
                            <div className="flex items-center gap-2 mb-2 px-1">
                                <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/40 shadow-[0_0_8px_rgba(20,184,166,0.2)]">
                                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                                </div>
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Thinking</span>
                            </div>
                            <div className="glass-premium rounded-[2rem] rounded-tl-sm px-6 py-5 flex gap-2 border border-white/5 shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-teal-500/[0.02] pointer-events-none" />
                                {[0, 0.15, 0.3].map((delay, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ y: [0, -8, 0], scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                                        transition={{ repeat: Infinity, duration: 1.2, delay, ease: "easeInOut" }}
                                        className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]"
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={chatEndRef} />
            </main>

            <div className="p-4 pb-24 bg-gradient-to-t from-[#050B14] via-[#050B14]/90 to-transparent z-20 shrink-0">
                <div className="max-w-lg mx-auto relative flex items-center shadow-2xl">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask an Islamic question..."
                        className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] pl-6 pr-16 py-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all font-medium shadow-inner"
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSend}
                        disabled={!inputVal.trim() || isTyping}
                        className="absolute right-2 w-[42px] h-[42px] bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-full flex items-center justify-center disabled:opacity-30 disabled:from-slate-700 disabled:to-slate-700 transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)] border border-teal-400/30"
                    >
                        <Send className="w-5 h-5 ml-0.5 drop-shadow-md" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default Hujra;
