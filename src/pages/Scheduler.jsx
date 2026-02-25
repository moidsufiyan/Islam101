import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScheduleStore } from '../store/useScheduleStore';
import {
    Clock, MapPin, Plus, X, Trash2, Bell, AlertCircle, CheckCircle2,
    Sun, CloudSun, Sunset, Moon, MoonStar, Loader2, Sparkles, ChevronRight
} from 'lucide-react';

const prayerIcons = { Fajr: Sun, Dhuhr: CloudSun, Asr: Sunset, Maghrib: Moon, Isha: MoonStar };
const prayerEmoji = { Fajr: '🌅', Dhuhr: '☀️', Asr: '🌤️', Maghrib: '🌙', Isha: '🌑' };

const springTransition = { type: 'spring', stiffness: 350, damping: 25, mass: 0.8 };

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: springTransition }
};

const Scheduler = () => {
    const {
        city, country, prayerTimes, scheduleBlocks, smartAlarms,
        isLoading, error, setLocation, addBlock, removeBlock
    } = useScheduleStore();

    const [cityInput, setCityInput] = useState(city || '');
    const [countryInput, setCountryInput] = useState(country || '');
    const [showAddBlock, setShowAddBlock] = useState(false);
    const [blockName, setBlockName] = useState('');
    const [blockStart, setBlockStart] = useState('09:00');
    const [blockEnd, setBlockEnd] = useState('10:00');

    const handleFetchTimes = () => {
        if (!cityInput.trim() || !countryInput.trim()) return;
        setLocation(cityInput.trim(), countryInput.trim());
    };

    const handleAddBlock = () => {
        if (!blockName.trim()) return;
        addBlock({ name: blockName.trim(), start: blockStart, end: blockEnd });
        setBlockName('');
        setBlockStart('09:00');
        setBlockEnd('10:00');
        setShowAddBlock(false);
    };

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="min-h-screen px-5 pt-10 pb-32 relative">
            {}
            <motion.header variants={itemVariants} className="mb-8 relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <div className="inline-flex items-center gap-1.5 text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-teal-500/20 shadow-[0_0_10px_rgba(20,184,166,0.1)]">
                        <Sparkles className="w-3 h-3" />
                        Smart Scheduler
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Time & Planning</h1>
                <p className="text-slate-400 text-sm mt-1 font-medium">Find the best time to pray around your schedule</p>
            </motion.header>

            {}
            <motion.section variants={itemVariants} className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-teal-400" />
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Your Location</h2>
                </div>
                <div className="glass-premium rounded-[2rem] p-5 shadow-xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl" />
                    <div className="flex gap-3 mb-4 relative z-10">
                        <input
                            type="text"
                            placeholder="City (e.g. Hyderabad)"
                            value={cityInput}
                            onChange={(e) => setCityInput(e.target.value)}
                            className="flex-1 bg-black/20 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all font-medium"
                        />
                        <input
                            type="text"
                            placeholder="Country"
                            value={countryInput}
                            onChange={(e) => setCountryInput(e.target.value)}
                            className="w-28 bg-black/20 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all font-medium"
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleFetchTimes}
                        disabled={isLoading || !cityInput.trim() || !countryInput.trim()}
                        className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold py-3.5 rounded-2xl text-sm disabled:opacity-40 flex items-center justify-center gap-2 shadow-[0_5px_15px_rgba(20,184,166,0.3)] transition-all relative z-10"
                    >
                        {isLoading ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Fetching Times...</>
                        ) : (
                            <><Clock className="w-5 h-5" /> Get Prayer Times</>
                        )}
                    </motion.button>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mt-4 text-rose-400 text-xs font-semibold bg-rose-500/10 px-3 py-2 rounded-xl border border-rose-500/20 relative z-10">
                            <AlertCircle className="w-4 h-4 flex-none" />{error}
                        </motion.div>
                    )}
                </div>
            </motion.section>

            {}
            <AnimatePresence>
                {prayerTimes && (
                    <motion.section
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="mb-8"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-4 h-4 text-teal-400" />
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Today's Times</h2>
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-teal-500/10 text-teal-400 px-2.5 py-1 rounded-full ml-auto shadow-inner border border-teal-500/20">
                                Live Data
                            </span>
                        </div>
                        <div className="grid grid-cols-5 gap-2.5">
                            {Object.entries(prayerTimes).filter(([k]) => k !== 'Sunrise').map(([name, time], i) => {
                                const Icon = prayerIcons[name];
                                return (
                                    <motion.div
                                        key={name}
                                        variants={itemVariants}
                                        whileHover={{ y: -3, scale: 1.05 }}
                                        className="glass-premium rounded-2xl p-3 text-center border-t border-white/5 shadow-lg group"
                                    >
                                        <div className="w-8 h-8 mx-auto mb-2 rounded-xl bg-teal-500/10 flex items-center justify-center group-hover:bg-teal-500/20 transition-colors">
                                            <Icon className="w-4 h-4 text-teal-400 drop-shadow-[0_0_5px_rgba(45,212,191,0.5)]" />
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{name}</p>
                                        <p className="text-sm text-white font-black tracking-tight">{time.replace(/ \(.*\)/, '')}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {}
            <motion.section variants={itemVariants} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-teal-400" />
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Your Commitments</h2>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddBlock(!showAddBlock)}
                        className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors ${showAddBlock ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'}`}
                    >
                        {showAddBlock ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        {showAddBlock ? 'Cancel' : 'Add Block'}
                    </motion.button>
                </div>

                {}
                <AnimatePresence>
                    {showAddBlock && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                            transition={springTransition}
                            className="glass-premium rounded-[2rem] p-5 mb-4 overflow-hidden border border-teal-500/20 shadow-[0_10px_30px_rgba(20,184,166,0.1)]"
                        >
                            <input
                                type="text"
                                placeholder="Block name (e.g. Physics Lecture)"
                                value={blockName}
                                onChange={(e) => setBlockName(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 mb-4 font-medium"
                            />
                            <div className="flex gap-3 mb-4">
                                <div className="flex-1">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Start Time</label>
                                    <input
                                        type="time"
                                        value={blockStart}
                                        onChange={(e) => setBlockStart(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500/50 [color-scheme:dark] font-bold"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">End Time</label>
                                    <input
                                        type="time"
                                        value={blockEnd}
                                        onChange={(e) => setBlockEnd(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500/50 [color-scheme:dark] font-bold"
                                    />
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddBlock}
                                disabled={!blockName.trim()}
                                className="w-full bg-teal-500/20 text-teal-300 font-bold py-3 rounded-2xl text-sm disabled:opacity-40 border border-teal-500/30 transition-all hover:bg-teal-500/30"
                            >
                                Add to Schedule
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {}
                {scheduleBlocks.length === 0 ? (
                    <motion.div variants={itemVariants} className="glass-premium rounded-3xl p-8 text-center border-dashed border-2 border-white/10">
                        <p className="text-4xl mb-3 opacity-50">🗓️</p>
                        <p className="text-white font-bold mb-1">No commitments added</p>
                        <p className="text-slate-400 text-xs">Add your class or work timings to find the best times to pray.</p>
                    </motion.div>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
                        {scheduleBlocks.map((block, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                layout
                                className="glass-premium rounded-2xl p-4 flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center border border-indigo-500/20">
                                        <Clock className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]" />
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-white mb-0.5">{block.name}</p>
                                        <p className="text-xs font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded-md inline-block">
                                            {block.start} <span className="opacity-50 mx-1">—</span> {block.end}
                                        </p>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 10 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => removeBlock(i)}
                                    className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                                >
                                    <Trash2 className="w-4.5 h-4.5 text-rose-400" />
                                </motion.button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </motion.section>

            {}
            <AnimatePresence>
                {smartAlarms.length > 0 && (
                    <motion.section
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-4 h-4 text-teal-400" />
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Smart Suggestions</h2>
                        </div>
                        <div className="space-y-4">
                            {smartAlarms.map((alarm, i) => {
                                const Icon = prayerIcons[alarm.prayer];
                                return (
                                    <motion.div
                                        key={alarm.prayer}
                                        variants={itemVariants}
                                        layout
                                        className={`rounded-3xl border p-5 glass-premium relative overflow-hidden ${alarm.hasConflict
                                            ? 'border-amber-500/20'
                                            : 'border-emerald-500/20'
                                            }`}
                                    >
                                        <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 pointer-events-none rounded-full ${alarm.hasConflict ? 'bg-amber-500' : 'bg-emerald-500'}`} />

                                        <div className="flex items-center justify-between mb-4 relative z-10">
                                            <div className="flex items-center gap-3.5">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${alarm.hasConflict ? 'bg-amber-500/15 border-amber-500/30' : 'bg-emerald-500/15 border-emerald-500/30'
                                                    }`}>
                                                    <Icon className={`w-6 h-6 ${alarm.hasConflict ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]'}`} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-white text-lg tracking-tight mb-0.5">{prayerEmoji[alarm.prayer]} {alarm.prayer}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-black/20 px-2 py-0.5 rounded-md inline-block">
                                                        Window: {alarm.originalTime} — {alarm.endTime}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                <div className={`px-3 py-1 mb-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${alarm.hasConflict ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                                    Suggested
                                                </div>
                                                <p className={`text-xl font-black ${alarm.hasConflict ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                    {alarm.suggestedTime}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`flex items-start gap-3 px-4 py-3 rounded-2xl relative z-10 border ${alarm.hasConflict ? 'bg-amber-500/[0.08] border-amber-500/10' : 'bg-emerald-500/[0.08] border-emerald-500/10'
                                            }`}>
                                            {alarm.hasConflict ? (
                                                <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-none drop-shadow-md" />
                                            ) : (
                                                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-none drop-shadow-md" />
                                            )}
                                            <p className="text-sm font-medium text-slate-200 leading-relaxed">{alarm.message}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Scheduler;

