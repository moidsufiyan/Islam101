import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createWorker } from 'tesseract.js';
import { analyzeIngredients } from '../data/haramIngredients';
import {
    Camera, Scan, AlertTriangle, CheckCircle2, X, ShieldCheck,
    Info, Loader2, Upload, ImageIcon, Sparkles, RotateCcw
} from 'lucide-react';

const springTransition = { type: 'tween', duration: 0.25, ease: 'easeOut' };

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: springTransition }
};

const Scanner = () => {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressLabel, setProgressLabel] = useState('');
    const [extractedText, setExtractedText] = useState('');
    const [results, setResults] = useState(null);
    const fileInputRef = useRef(null);

    const handleCapture = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
        setResults(null);
        setExtractedText('');
    };

    const handleAnalyze = async () => {
        if (!image) return;
        setIsProcessing(true);
        setProgress(0);
        setProgressLabel('Initializing OCR...');

        try {
            const worker = await createWorker('eng', 1, {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        setProgress(Math.round(m.progress * 100));
                        setProgressLabel('Reading ingredients...');
                    } else if (m.status === 'loading language traineddata') {
                        setProgressLabel('Loading language data...');
                    }
                },
            });

            const { data: { text } } = await worker.recognize(image);
            await worker.terminate();

            setExtractedText(text);
            setProgressLabel('Analyzing...');



            const analysis = analyzeIngredients(text);
            setResults(analysis);
        } catch (err) {
            console.error('OCR Error:', err);
            setProgressLabel('Error processing image. Try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        setImage(null);
        setImagePreview(null);
        setResults(null);
        setExtractedText('');
        setProgress(0);
        setProgressLabel('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const safeCount = results ? results.safe.length : 0;
    const flaggedCount = results ? results.flagged.length : 0;
    const totalCount = safeCount + flaggedCount;
    const safePercent = totalCount > 0 ? Math.round((safeCount / totalCount) * 100) : 0;

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="min-h-screen px-5 pt-10 pb-32 relative">
            { }
            <motion.header variants={itemVariants} className="mb-8 relative z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="inline-flex items-center gap-1.5 text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-teal-500/20 shadow-[0_0_10px_rgba(20,184,166,0.1)]">
                                <Sparkles className="w-3 h-3" />
                                Smart Scanner
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Halal Lens</h1>
                        <p className="text-slate-400 text-sm mt-1 font-medium">Snap ingredients → instant analysis</p>
                    </div>
                    {image && (
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: -90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleReset}
                            className="w-10 h-10 rounded-2xl bg-white/[0.08] flex items-center justify-center border border-white/10 hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                        >
                            <RotateCcw className="w-4.5 h-4.5" />
                        </motion.button>
                    )}
                </div>
            </motion.header>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCapture}
                className="hidden"
            />
            {!image ? (
                <motion.div variants={itemVariants} className="mb-6">
                    <motion.div
                        whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.04)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => fileInputRef.current?.click()}
                        className="glass-premium rounded-[2rem] p-8 flex flex-col items-center justify-center cursor-pointer transition-all border-2 border-dashed border-teal-500/30 hover:border-teal-400/60 min-h-[300px] group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-emerald-500/0 p-1 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <motion.div
                            className="w-20 h-20 rounded-3xl bg-teal-500/10 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(20,184,166,0.15)] group-hover:shadow-[0_0_30px_rgba(20,184,166,0.3)] transition-shadow border border-teal-500/20 relative z-10"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <Camera className="w-10 h-10 text-teal-400 drop-shadow-lg" />
                        </motion.div>
                        <p className="text-white font-bold text-xl mb-2 relative z-10">Scan Label</p>
                        <p className="text-slate-400 text-sm text-center max-w-[250px] mb-8 relative z-10">
                            Capture ingredients on any product package for instant verification
                        </p>
                        <div className="flex flex-col w-full gap-3 relative z-10">
                            <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white w-full py-4 rounded-2xl text-base font-semibold shadow-[0_5px_20px_rgba(20,184,166,0.3)] group-hover:glow-teal-strong transition-all">
                                <Camera className="w-5 h-5" />
                                Take Photo
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            ) : (
                <motion.div variants={itemVariants} className="mb-8">
                    { }
                    <motion.div layoutId="imagePreview" className="glass-premium rounded-3xl p-2 mb-5 relative overflow-hidden border border-white/10 shadow-2xl">
                        <div className="relative rounded-2xl overflow-hidden bg-black/40">
                            <img
                                src={imagePreview}
                                alt="Captured ingredients"
                                className={`w-full max-h-64 object-cover rounded-2xl transition-all duration-700 ${isProcessing ? 'blur-sm scale-105 opacity-60' : 'opacity-100'}`}
                            />
                            {isProcessing && (
                                <>
                                    { }
                                    <motion.div
                                        className="absolute left-0 w-full h-[3px] bg-teal-400 shadow-[0_0_20px_8px_rgba(45,212,191,0.5)] z-20"
                                        animate={{ top: ['0%', '100%', '0%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                    />

                                    { }
                                    <div className="absolute inset-4 border-2 border-teal-500/30 rounded-xl z-20 pointer-events-none">
                                        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-teal-400 rounded-tl-xl" />
                                        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-teal-400 rounded-tr-xl" />
                                        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-teal-400 rounded-bl-xl" />
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-teal-400 rounded-br-xl" />
                                    </div>

                                    <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
                                        <div className="bg-black/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 flex flex-col items-center">
                                            <Sparkles className="w-8 h-8 text-teal-400 mb-3 animate-pulse-slow drop-shadow-[0_0_10px_rgba(45,212,191,0.8)]" />
                                            <p className="text-white text-sm font-bold tracking-widest uppercase mb-1">{progressLabel}</p>
                                            <p className="text-[20px] font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300 drop-shadow-md">{progress}%</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>

                    { }
                    <AnimatePresence>
                        {!results && !isProcessing && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                onClick={handleAnalyze}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold py-4 rounded-2xl text-base shadow-[0_5px_20px_rgba(20,184,166,0.3)] flex items-center justify-center gap-2 glow-teal transition-all group overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer transition-all" />
                                <Scan className="w-5 h-5 relative z-10" />
                                <span className="relative z-10 tracking-wide">Analyze Ingredients</span>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}

            { }
            <AnimatePresence>
                {results && (
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="space-y-5"
                    >
                        { }
                        <motion.div variants={itemVariants} className="glass-premium rounded-3xl p-6 shadow-xl relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 pointer-events-none rounded-full ${safePercent >= 80 ? 'bg-emerald-500' : safePercent >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                            <div className="flex items-center justify-between mb-5 relative z-10">
                                <h2 className="text-xl font-black text-white tracking-tight">Analysis Result</h2>
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${flaggedCount > 0 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    }`}>
                                    {flaggedCount > 0 ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                                    {flaggedCount > 0 ? `${flaggedCount} Flagged` : 'All Clear'}
                                </div>
                            </div>

                            { }
                            <div className="relative z-10">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Halal Confidence</span>
                                    <span className={`text-2xl font-black ${safePercent >= 80 ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : safePercent >= 50 ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]'}`}>
                                        {totalCount > 0 ? `${safePercent}%` : 'N/A'}
                                    </span>
                                </div>
                                <div className="w-full h-3 bg-white/[0.04] rounded-full overflow-hidden shadow-inner border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${safePercent}%` }}
                                        transition={{ ...springTransition, duration: 1.5 }}
                                        className={`h-full rounded-full ${safePercent >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : safePercent >= 50 ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 'bg-gradient-to-r from-rose-500 to-red-400'}`}
                                    />
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">{safeCount} Safe</span>
                                    <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">{flaggedCount} Flagged</span>
                                </div>
                            </div>
                        </motion.div>

                        { }
                        {flaggedCount > 0 && (
                            <motion.div variants={itemVariants}>
                                <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest mb-3 px-1 drop-shadow-sm">⚠️ Flagged Items</h3>
                                <div className="space-y-3">
                                    {results.flagged.map((ing, i) => (
                                        <motion.div
                                            key={`f-${i}`}
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.01, x: 2 }}
                                            className="flex items-center gap-4 p-4 rounded-2xl border bg-gradient-to-r from-rose-500/10 to-transparent border-rose-500/20 shadow-lg backdrop-blur-md"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center flex-none border border-rose-500/30">
                                                <AlertTriangle className="w-5 h-5 text-rose-400 drop-shadow-[0_0_5px_rgba(251,113,133,0.8)]" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-base text-rose-100 mb-0.5">
                                                    {ing.code ? <span className="text-rose-400">{ing.code} — </span> : ''}{ing.name}
                                                </p>
                                                <p className="text-xs text-rose-200/70 font-medium leading-relaxed">{ing.reason}</p>
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${ing.status === 'haram' ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 shadow-[0_0_10px_rgba(225,29,72,0.3)]' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                                }`}>
                                                {ing.status}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        { }
                        {safeCount > 0 && (
                            <motion.div variants={itemVariants}>
                                <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-3 px-1 drop-shadow-sm">✅ Safe Items</h3>
                                <div className="space-y-2">
                                    {results.safe.map((ing, i) => (
                                        <motion.div
                                            key={`s-${i}`}
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.01, backgroundColor: 'rgba(16,185,129,0.08)' }}
                                            className="flex items-center gap-3 p-3.5 rounded-2xl border bg-emerald-500/[0.03] border-emerald-500/10 transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-none">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                            </div>
                                            <p className="font-bold text-sm text-emerald-100">{ing.name}</p>
                                            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 ml-auto border border-emerald-500/20">Halal</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        { }
                        {extractedText && (
                            <motion.div variants={itemVariants} className="glass-premium rounded-2xl p-5 border border-white/5">
                                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">📝 Raw OCR Text</h3>
                                <p className="text-[11px] text-slate-400 leading-relaxed font-mono whitespace-pre-wrap max-h-32 overflow-y-auto hide-scrollbar selection:bg-teal-500/30">
                                    {extractedText}
                                </p>
                            </motion.div>
                        )}

                        { }
                        <motion.div variants={itemVariants} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                            <Info className="w-5 h-5 text-slate-500 flex-none mt-0.5" />
                            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                OCR accuracy depends on image quality. Always verify with the physical label. Consult a qualified scholar for definitive rulings on specific ingredients.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Scanner;

