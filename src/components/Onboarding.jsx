import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMadhabStore } from '../store/useMadhabStore';
import { Sparkles, ChevronRight } from 'lucide-react';

const madhabs = [
    { id: 'hanafi', name: 'Hanafi', emoji: '📖', desc: 'Most followed worldwide' },
    { id: 'shafii', name: "Shafi'i", emoji: '🌙', desc: 'Southeast Asia & East Africa' },
    { id: 'salafi', name: 'Salafi', emoji: '🕋', desc: 'Return to foundations' },
    { id: 'sufi-sunni', name: 'Sufi / Sunni', emoji: '💚', desc: 'Spiritual path of love' },
    { id: 'shia', name: 'Shia', emoji: '🤲', desc: 'Ahlul Bayt tradition' },
    { id: 'ahle-hadees', name: 'Ahle Hadees', emoji: '📜', desc: 'Hadith-centric approach' },
    { id: 'tableegh', name: 'Tableegh', emoji: '🚶', desc: 'Dawah movement' },
    { id: 'universal', name: 'Universal', emoji: '🌍', desc: 'All traditions welcome' },
];

const springTransition = { type: 'spring', stiffness: 300, damping: 24, mass: 0.8 };

const Onboarding = () => {
    const [step, setStep] = useState(0);
    const [selectedId, setSelectedId] = useState(null);
    const setMadhab = useMadhabStore((state) => state.setMadhab);

    const handleSelect = (id) => {
        setSelectedId(id);
    };

    const handleConfirm = () => {
        if (!selectedId) return;
        setMadhab(selectedId);
    };

    return (
        <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {}

            <AnimatePresence mode="wait">
                {step === 0 ? (
                    <motion.div
                        key="welcome"
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.95, filter: 'blur(8px)' }}
                        transition={springTransition}
                        className="max-w-sm w-full text-center relative z-10"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                            className="text-[80px] mb-8 animate-float drop-shadow-2xl"
                        >
                            🕌
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, ...springTransition }}
                            className="text-4xl font-bold text-white mb-3 tracking-tight"
                        >
                            Islam<span className="text-gradient-shimmer">101</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-slate-400 text-base mb-12 leading-relaxed"
                        >
                            Your personal spiritual companion.<br />
                            Built with love, sealed with purpose.
                        </motion.p>

                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, ...springTransition }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setStep(1)}
                            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold py-4 rounded-2xl shadow-[0_0_30px_rgba(20,184,166,0.25)] flex items-center justify-center gap-2 text-base relative overflow-hidden group border border-teal-400/30"
                        >
                            {}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer transition-all" />
                            <span className="relative z-10">Begin Your Journey</span>
                            <ChevronRight className="w-5 h-5 relative z-10" />
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="selector"
                        initial={{ opacity: 0, y: 30, scale: 0.95, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -30, scale: 0.95 }}
                        transition={springTransition}
                        className="max-w-md w-full relative z-10 pt-8 pb-10"
                    >
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, ...springTransition }}
                                className="inline-flex items-center gap-2 text-teal-400 bg-teal-500/10 px-3 py-1.5 rounded-full text-xs font-medium mb-4 border border-teal-500/20"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                Personalize
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, ...springTransition }}
                                className="text-3xl font-bold text-white mb-2"
                            >
                                Your Beliefs
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-slate-400 text-sm"
                            >
                                This tailors your entire experience.
                            </motion.p>
                        </div>

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
                            }}
                            className="grid grid-cols-2 gap-3 mb-8"
                        >
                            {madhabs.map((madhab) => (
                                <motion.button
                                    key={madhab.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 20, scale: 0.95 },
                                        visible: { opacity: 1, y: 0, scale: 1, transition: springTransition },
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => handleSelect(madhab.id)}
                                    className={`relative p-4 rounded-2xl text-left transition-colors duration-300 ${selectedId === madhab.id
                                        ? 'glass-premium border-teal-500/50 glow-teal shadow-xl'
                                        : 'glass-premium hover:bg-white/[0.04]'
                                        }`}
                                >
                                    <span className="text-2xl block mb-2">{madhab.emoji}</span>
                                    <p className={`font-semibold text-sm relative z-10 transition-colors ${selectedId === madhab.id ? 'text-teal-300' : 'text-white'
                                        }`}>
                                        {madhab.name}
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed relative z-10">{madhab.desc}</p>

                                    {selectedId === madhab.id && (
                                        <motion.div
                                            layoutId="select-ring"
                                            className="absolute inset-0 rounded-2xl border-[2px] border-teal-400/80 bg-teal-500/10"
                                            transition={{ type: 'spring', stiffness: 350, damping: 25, mass: 0.8 }}
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            whileHover={selectedId ? { scale: 1.03 } : {}}
                            whileTap={selectedId ? { scale: 0.96 } : {}}
                            onClick={handleConfirm}
                            disabled={!selectedId}
                            className={`w-full font-semibold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-base transition-all duration-300 ${selectedId
                                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-teal-500/25 border border-teal-400/30 glow-teal-strong'
                                    : 'glass-premium text-slate-500 border-white/[0.05] cursor-not-allowed'
                                }`}
                        >
                            Continue
                            <ChevronRight className={`w-5 h-5 ${selectedId ? 'opacity-100' : 'opacity-40'}`} />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Onboarding;

