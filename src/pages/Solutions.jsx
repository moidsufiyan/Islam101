import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { solutions, categories } from '../data/solutions';
import { Search, BookOpen, Filter, Sparkles, ChevronDown, ChevronUp, Tag } from 'lucide-react';

const categoryEmoji = {
    'All': '📚', 'Prayer': '🕌', 'Fasting': '🌙',
    'Food': '🍽️', 'Daily Life': '💼', 'Spirituality': '🤲',
};

const springTransition = { type: 'tween', duration: 0.25, ease: 'easeOut' };

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: springTransition }
};

const Solutions = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [expandedId, setExpandedId] = useState(null);

    const filteredSolutions = useMemo(() => {
        return solutions.filter((sol) => {
            if (selectedCategory !== 'All' && sol.category !== selectedCategory) {
                return false;
            }

            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                return (
                    sol.question.toLowerCase().includes(q) ||
                    sol.shortAnswer.toLowerCase().includes(q) ||
                    sol.category.toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [searchQuery, selectedCategory]);

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="min-h-screen gradient-bg px-5 pt-10 pb-32">
            {}
            <motion.header variants={itemVariants} className="mb-10">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-widest mb-3 bg-teal-500/10 w-fit px-3 py-1 rounded-full border border-teal-500/20">
                    <Sparkles size={14} />
                    Unified Islamic Knowledge
                </div>
                <h1 className="text-3xl font-black text-white leading-tight">
                    Divine <span className="text-gradient">Solutions</span>
                </h1>
                <p className="text-slate-400 text-sm mt-2 max-w-[280px] leading-relaxed">
                    Guided by the Quran and Sunnah. One Ummah, one path.
                </p>
            </motion.header>

            {}
            <motion.div variants={itemVariants} className="relative mb-8 group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Search for guidance..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full glass-premium rounded-2xl py-4.5 pl-14 pr-6 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all border border-white/5"
                />
            </motion.div>

            {}
            <motion.div variants={itemVariants} className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide -mx-5 px-5">
                {categories.map((cat) => (
                    <motion.button
                        key={cat}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-5 py-3 rounded-2xl whitespace-nowrap text-xs font-bold transition-all border flex items-center gap-2 ${selectedCategory === cat
                            ? 'bg-teal-500 text-white border-teal-400 shadow-lg shadow-teal-500/20'
                            : 'bg-white/[0.03] text-slate-400 border-white/5 hover:bg-white/[0.06]'
                            }`}
                    >
                        <span>{categoryEmoji[cat] || '✨'}</span>
                        {cat}
                    </motion.button>
                ))}
            </motion.div>

            {}
            <div className="space-y-4">
                {filteredSolutions.length > 0 ? (
                    filteredSolutions.map((sol) => (
                        <motion.div
                            key={sol.id}
                            variants={itemVariants}
                            layout
                            className={`glass-premium rounded-3xl border border-white/5 overflow-hidden transition-all duration-300 ${expandedId === sol.id ? 'shadow-2xl shadow-teal-500/5 ring-1 ring-teal-500/20' : ''
                                }`}
                        >
                            <button
                                onClick={() => setExpandedId(expandedId === sol.id ? null : sol.id)}
                                className="w-full text-left p-6 flex items-start justify-between gap-4"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-teal-400/80 px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20">
                                            {sol.category}
                                        </span>
                                    </div>
                                    <h3 className="text-[15px] font-bold text-white leading-snug">
                                        {sol.question}
                                    </h3>
                                </div>
                                <div className={`mt-1 p-1 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors ${expandedId === sol.id ? 'rotate-180 bg-teal-500/20' : ''}`}>
                                    <ChevronDown size={18} className={expandedId === sol.id ? 'text-teal-400' : 'text-slate-500'} />
                                </div>
                            </button>

                            <AnimatePresence>
                                {expandedId === sol.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <div className="px-6 pb-6 space-y-5">
                                            {}
                                            <div className="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <BookOpen size={14} className="text-teal-400" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Guidance</span>
                                                </div>
                                                <p className="text-[14px] text-white font-semibold leading-relaxed">
                                                    {sol.shortAnswer}
                                                </p>
                                            </div>

                                            {}
                                            <div className="border-l-4 border-teal-500 pl-4 py-2 bg-gradient-to-r from-teal-500/10 to-transparent rounded-r-xl">
                                                <p className="font-serif text-[15px] text-teal-100 leading-relaxed whitespace-pre-wrap drop-shadow">
                                                    "{sol.evidence}"
                                                </p>
                                            </div>

                                            {}
                                            <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                                {sol.explanation}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                ) : (
                    <motion.div
                        variants={itemVariants}
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                            <Filter className="w-8 h-8 text-slate-600" />
                        </div>
                        <p className="text-slate-400 font-bold mb-1">No results found</p>
                        <p className="text-slate-600 text-xs mt-2 border border-slate-800/50 rounded-lg px-3 py-1.5 w-max mx-auto">
                            Try adjusting your search or category
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default Solutions;
