import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ShieldCheck, Sparkles, Copy, Check, User } from 'lucide-react';

const guidedResponses = [
    {
        shortAnswer: "Start with small, consistent steps. Don't let 'all or nothing' thinking keep you from praying.",
        evidence: "Allah loves those who constantly repent and loves those who purify themselves. [Surah Al-Baqarah 2:222]\n\nThe Prophet ﷺ said: 'The most beloved of deeds to Allah are those that are most consistent, even if it is small.' [Bukhari]",
        explanation: "When you feel overwhelmed, Shaytan uses guilt to push you further away. Feeling like a hypocrite is actually a sign of faith — it means your heart is alive. Start with just the obligatory (Fard) prayers, even if late. Consistency builds the habit."
    },
    {
        shortAnswer: "Knowledge is the foundation. Seek it daily, even in small amounts.",
        evidence: "Say: 'Are those who know equal to those who do not know?' [Surah Az-Zumar 39:9]\n\nThe Prophet ﷺ said: 'Seeking knowledge is an obligation upon every Muslim.' [Ibn Majah]",
        explanation: "Islam values education deeply. Try dedicating just 10 minutes a day to learning — read a page of Quran with translation, listen to a short lecture, or study a hadith. Small consistent effort will compound into deep understanding over time."
    },
    {
        shortAnswer: "Balance is the key. Islam is the middle path — neither extreme harshness nor negligence.",
        evidence: "And thus We have made you a middle nation. [Surah Al-Baqarah 2:143]\n\nThe Prophet ﷺ said: 'Make things easy and do not make them difficult.' [Bukhari]",
        explanation: "Don't burn yourself out trying to do everything at once. Islam encourages moderation. Focus on your obligations first, then gradually add voluntary acts of worship as your capacity grows."
    }
];

const springTransition = { type: 'spring', stiffness: 350, damping: 25, mass: 0.8 };

const Hujra = () => {
    const [tone, setTone] = useState('brother');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [inputVal, setInputVal] = useState('');
    const [responseIdx, setResponseIdx] = useState(0);
    const [copiedId, setCopiedId] = useState(null);
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const simulateGuidedResponse = () => {
        setIsTyping(true);
        const delay = 1500 + Math.random() * 1500;
        setTimeout(() => {
            setIsTyping(false);
            const response = guidedResponses[responseIdx % guidedResponses.length];
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'assistant',
                ...response
            }]);
            setResponseIdx(prev => prev + 1);
        }, delay);
    };

    const handleSend = () => {
        const text = inputVal.trim();
        if (!text || isTyping) return;
        setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
        setInputVal('');
        setTimeout(simulateGuidedResponse, 300);
    };

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };



    useEffect(() => {
        setMessages([
            {
                id: 1,
                sender: 'user',
                text: "I've been feeling overwhelmed with my studies and I keep missing my prayers. How can I get back on track?"
            }
        ]);
        setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                setMessages(prev => [...prev, {
                    id: 2,
                    sender: 'assistant',
                    ...guidedResponses[0]
                }]);
                setResponseIdx(1);
            }, 2000);
        }, 500);
    }, []);

    return (
        <div className="h-screen flex flex-col relative overflow-hidden bg-[#050B14]">
            {}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-teal-500/[0.04] rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[80px] pointer-events-none" />

            {}
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

                {}
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

            {}
            <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 hide-scrollbar z-10 relative">
                {}
                {messages.length <= 2 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={springTransition}
                        className="text-center py-6 mb-4 glass-premium rounded-[2rem] border border-white/5 mx-2"
                    >
                        <div className="inline-flex items-center gap-2 bg-teal-500/10 text-teal-400 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3 border border-teal-500/20 shadow-inner">
                            <Sparkles className="w-3.5 h-3.5" />
                            Virtual Guided Advice
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-[250px] mx-auto font-medium">
                            Ask any question about life, faith, or struggles.<br />
                            <span className="text-teal-400/80 font-semibold mt-1 block">All conversations are private.</span>
                        </p>
                    </motion.div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
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

                            <div className={`rounded-3xl p-5 relative overflow-hidden ${msg.sender === 'user'
                                ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-tr-sm shadow-[0_10px_20px_rgba(20,184,166,0.25)] border-t border-teal-400/40 border-l border-teal-400/20'
                                : 'glass-premium rounded-tl-sm border border-white/[0.08] shadow-lg'
                                }`}>
                                {}
                                {msg.sender === 'user' && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                                )}

                                {msg.sender === 'user' ? (
                                    <p className="text-[15px] font-medium leading-relaxed relative z-10 drop-shadow-sm">{msg.text}</p>
                                ) : (
                                    <div className="space-y-4">
                                        {}
                                        <p className="font-black text-base text-teal-300 leading-snug drop-shadow-sm">
                                            {msg.shortAnswer}
                                        </p>

                                        {}
                                        <div className="border-l-4 border-teal-500 pl-4 py-2.5 bg-gradient-to-r from-teal-500/10 to-transparent rounded-r-xl">
                                            <p className="font-serif text-[14px] leading-relaxed whitespace-pre-wrap text-teal-100/90 drop-shadow-md">
                                                "{msg.evidence}"
                                            </p>
                                        </div>

                                        {}
                                        <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                            {msg.explanation}
                                        </p>

                                        {}
                                        <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04] mt-2">
                                            <button
                                                onClick={() => handleCopy(`${msg.shortAnswer}\n\n${msg.evidence}\n\n${msg.explanation}`, msg.id)}
                                                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors bg-black/20 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/5 active:scale-95 transition-transform"
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

                    {}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
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

            {}
            <div className="sticky bottom-0 p-5 bg-gradient-to-t from-[#050B14] via-[#050B14]/90 to-transparent z-20">
                <div className="max-w-lg mx-auto relative flex items-center shadow-2xl">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask anything securely..."
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

