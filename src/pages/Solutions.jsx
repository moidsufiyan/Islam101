import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMadhabStore } from '../store/useMadhabStore';
import { solutions, categories } from '../data/solutions';
import { Search, BookOpen, Filter, Sparkles, ChevronDown, ChevronUp, Tag } from 'lucide-react';

const madhabNames = {
    'hanafi': 'Hanafi', 'shafii': "Shafi'i", 'salafi': 'Salafi',
    'sufi-sunni': 'Sufi / Sunni', 'shia': 'Shia', 'ahle-hadees': 'Ahle Hadees',
    'tableegh': 'Tableegh', 'universal': 'Universal',
};

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
    const madhab = useMadhabStore((state) => state.selectedMadhab);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [expandedId, setExpandedId] = useState(null);

    const filteredSolutions = useMemo(() => {
        return solutions.filter((sol) => {


            if (!sol.madhab_tags.includes(madhab) && !sol.madhab_tags.includes('universal')) {
                return false;
            }


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
    }, [madhab, searchQuery, selectedCategory]);

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="min-h-screen px-5 pt-10 pb-32 relative">
            {}
            <motion.header variants={itemVariants} className="mb-8 relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <div className="inline-flex items-center gap-1.5 text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-teal-500/20 shadow-[0_0_10px_rgba(20,184,166,0.1)]">
                        <Filter className="w-3 h-3" />
                        {madhabNames[madhab] || 'Universal'} Filtered
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Solutions Library</h1>
                <p className="text-slate-400 text-sm mt-1 font-medium">Answers according to your beliefs</p>
            </motion.header>

            {}
            <motion.div variants={itemVariants} className="relative mb-6 group">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-emerald-500/0 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative glass-premium rounded-2xl flex items-center">
                    <Search className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-teal-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search rulings, questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none pl-12 pr-4 py-4 text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all rounded-2xl"
                    />
                </div>
            </motion.div>

            {}
            <motion.div variants={itemVariants} className="flex gap-3 overflow-x-auto hide-scrollbar mb-8 -mx-2 px-2 pb-2">
                {categories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                        <motion.button
                            key={cat}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCategory(cat)}
                            className={`flex-none flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 relative ${isSelected
                                    ? 'bg-transparent text-white border-transparent'
                                    : 'glass-premium border-white/[0.04] text-slate-400'
                                }`}
                        >
                            {isSelected && (
                                <motion.div
                                    layoutId="category-pill"
                                    className="absolute inset-0 bg-teal-500/20 border border-teal-500/40 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                                    transition={springTransition}
                                />
                            )}
                            <span className="relative z-10 text-lg">{categoryEmoji[cat]}</span>
                            <span className={`relative z-10 font-bold text-sm tracking-wide ${isSelected ? 'text-teal-300' : ''}`}>
                                {cat}
                            </span>
                        </motion.button>
                    );
                })}
            </motion.div>

            {}
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-5">
                <p className="text-[12px] font-bold uppercase tracking-wider text-slate-500">
                    {filteredSolutions.length} result{filteredSolutions.length !== 1 ? 's' : ''} found
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                    <Tag className="w-3 h-3 text-teal-500" />
                    {madhabNames[madhab] || madhab}
                </div>
            </motion.div>

            {}
            {filteredSolutions.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16 glass-premium rounded-3xl"
                >
                    <p className="text-5xl mb-4 animate-float">🔍</p>
                    <p className="text-white font-bold text-lg mb-2">No results found</p>
                    <p className="text-slate-400 text-sm max-w-[200px] mx-auto">
                        {searchQuery
                            ? 'Try different keywords or clear your search.'
                            : `No rulings available for the ${madhabNames[madhab] || madhab} tradition in this category.`}
                    </p>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence initial={false}>
                        {filteredSolutions.map((sol, i) => {
                            const isExpanded = expandedId === sol.id;
                            return (
                                <motion.div
                                    key={sol.id}
                                    variants={itemVariants}
                                    layout
                                    className={`glass-premium rounded-3xl overflow-hidden border transition-colors duration-300 ${isExpanded ? 'border-teal-500/30 shadow-[0_10px_30px_rgba(20,184,166,0.1)]' : 'border-white/[0.04]'}`}
                                >
                                    {}
                                    <motion.button
                                        layout="position"
                                        onClick={() => setExpandedId(isExpanded ? null : sol.id)}
                                        className="w-full p-5 text-left flex items-start gap-4"
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-none mt-0.5 transition-colors ${isExpanded ? 'bg-teal-500/20' : 'bg-teal-500/10'}`}>
                                            <BookOpen className={`w-5 h-5 ${isExpanded ? 'text-teal-300 drop-shadow-[0_0_5px_rgba(45,212,191,0.5)]' : 'text-teal-500'}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/[0.04] text-teal-400 border border-teal-500/20 px-2.5 py-1 rounded-full shadow-inner">
                                                    {categoryEmoji[sol.category]} {sol.category}
                                                </span>
                                            </div>
                                            <p className={`text-base font-bold leading-snug transition-colors ${isExpanded ? 'text-white' : 'text-slate-200'}`}>
                                                {sol.question}
                                            </p>
                                        </div>
                                        <div className="flex-none mt-1">
                                            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={springTransition}>
                                                <ChevronDown className={`w-5 h-5 ${isExpanded ? 'text-teal-400' : 'text-slate-500'}`} />
                                            </motion.div>
                                        </div>
                                    </motion.button>

                                    {}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={springTransition}
                                                className="overflow-hidden bg-black/20"
                                            >
                                                <div className="px-5 pb-5 pt-4 space-y-5 border-t border-white/[0.04]">
                                                    {}
                                                    <p className="font-bold text-lg text-teal-300 leading-snug drop-shadow-md">
                                                        {sol.shortAnswer}
                                                    </p>

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

                                                    {}
                                                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.04]">
                                                        {sol.madhab_tags.filter(t => t !== 'universal').slice(0, 5).map(tag => (
                                                            <span
                                                                key={tag}
                                                                className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg ${tag === madhab
                                                                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-[0_0_10px_rgba(20,184,166,0.15)]'
                                                                    : 'bg-white/[0.02] text-slate-500 border border-white/5'
                                                                    }`}
                                                            >
                                                                {madhabNames[tag] || tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};

export default Solutions;

