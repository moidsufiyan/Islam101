import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMadhabStore } from '../store/useMadhabStore';
import { UserRound, Settings, LogOut, ChevronRight, Moon, Bell, BookOpen, Heart, Scan, MessageCircleHeart, Sparkles, Shield } from 'lucide-react';

const springTransition = { type: 'spring', stiffness: 350, damping: 25, mass: 0.8 };

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: springTransition }
};

const Profile = () => {
    const madhab = useMadhabStore((state) => state.selectedMadhab);
    const userName = useMadhabStore((state) => state.userName);
    const clearMadhab = useMadhabStore((state) => state.clearMadhab);
    const [notifications, setNotifications] = useState(true);

    const stats = [
        { icon: BookOpen, label: 'Verses Read', value: '147', color: 'text-teal-400', bg: 'bg-teal-500/15', border: 'border-teal-500/20' },
        { icon: Heart, label: 'Days Active', value: '23', color: 'text-rose-400', bg: 'bg-rose-500/15', border: 'border-rose-500/20' },
        { icon: MessageCircleHeart, label: 'Questions', value: '12', color: 'text-violet-400', bg: 'bg-violet-500/15', border: 'border-violet-500/20' },
        { icon: Scan, label: 'Scans', value: '8', color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/20' },
    ];

    const madhabName = {
        'hanafi': 'Hanafi',
        'shafii': "Shafi'i",
        'salafi': 'Salafi',
        'sufi-sunni': 'Sufi / Sunni',
        'shia': 'Shia',
        'ahle-hadees': 'Ahle Hadees',
        'tableegh': 'Tableegh',
        'universal': 'Universal',
    };

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="min-h-screen gradient-bg px-5 pt-10 pb-32 relative">
            {}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-teal-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

            {}
            <motion.div
                variants={itemVariants}
                className="flex flex-col items-center mb-10 relative z-10"
            >
                <div className="relative mb-5 group cursor-pointer">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-[104px] h-[104px] bg-gradient-to-br from-teal-400 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-[0_15px_30px_rgba(20,184,166,0.3)] relative z-10 group-hover:shadow-[0_20px_40px_rgba(20,184,166,0.4)] transition-shadow"
                    >
                        <UserRound size={44} strokeWidth={1.5} className="drop-shadow-md" />
                    </motion.div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full border-[3px] border-[#050B14] flex items-center justify-center z-20 shadow-lg">
                        <Shield className="w-4 h-4 text-white drop-shadow-sm" />
                    </div>
                    {}
                    <div className="absolute inset-[-10px] rounded-full border border-teal-500/20 scale-100 group-hover:scale-110 group-hover:opacity-0 transition-all duration-700 pointer-events-none" />
                    <div className="absolute inset-[-20px] rounded-full border border-teal-500/10 scale-100 group-hover:scale-110 group-hover:opacity-0 transition-all duration-[900ms] delay-75 pointer-events-none" />
                </div>
                <h1 className="text-3xl font-black text-white mb-1.5 tracking-tight">{userName}</h1>
                <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold uppercase tracking-widest bg-teal-500/10 px-3 py-1.5 rounded-full border border-teal-500/20 shadow-inner">
                    <Sparkles className="w-3.5 h-3.5" />
                    {madhabName[madhab] || madhab || 'Not Selected'}
                </div>
            </motion.div>

            {}
            <motion.div
                variants={itemVariants}
                className="grid grid-cols-4 gap-3 mb-10"
            >
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className={`glass-premium rounded-2xl p-3 flex flex-col items-center justify-center gap-2 border-t ${stat.border} shadow-lg`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${stat.border} ${stat.bg}`}>
                                <Icon className={`w-4.5 h-4.5 ${stat.color} drop-shadow-[0_0_8px_currentColor] opacity-90`} />
                            </div>
                            <div className="text-center">
                                <span className="block text-white font-black text-xl leading-none mb-1">{stat.value}</span>
                                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-tight w-min mx-auto">{stat.label.replace(' ', '\n')}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {}
            <motion.section
                variants={itemVariants}
                className="mb-8"
            >
                <div className="flex items-center gap-2 mb-4 px-1">
                    <Settings className="w-4 h-4 text-slate-400" />
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Preferences & Settings
                    </h2>
                </div>
                <div className="glass-premium rounded-[2rem] overflow-hidden border border-white/5 shadow-xl">
                    {}
                    <motion.div whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }} className="p-5 flex items-center justify-between border-b border-white/[0.04] cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center border border-teal-500/20">
                                <BookOpen className="w-4.5 h-4.5 text-teal-400" />
                            </div>
                            <span className="text-white font-semibold text-[15px]">School of Thought</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-teal-400 font-bold text-sm">
                                {madhabName[madhab] || madhab || 'Not Set'}
                            </span>
                            <ChevronRight className="w-4.5 h-4.5 text-slate-500" />
                        </div>
                    </motion.div>

                    {}
                    <div className="p-5 flex items-center justify-between border-b border-white/[0.04]">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center border border-violet-500/20">
                                <Bell className="w-4.5 h-4.5 text-violet-400" />
                            </div>
                            <span className="text-white font-semibold text-[15px]">Prayer Reminders</span>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`w-12 h-7 rounded-full relative transition-colors duration-300 border border-white/10 ${notifications ? 'bg-teal-500 border-teal-400' : 'bg-white/5'
                                }`}
                        >
                            <motion.div
                                animate={{ x: notifications ? 20 : 2 }}
                                transition={springTransition}
                                className="absolute top-[2px] w-5 h-5 bg-white rounded-full shadow-md"
                            />
                        </button>
                    </div>

                    {}
                    <div className="p-5 flex items-center justify-between border-b border-white/[0.04] opacity-50 cursor-not-allowed">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center border border-indigo-500/20">
                                <Moon className="w-4.5 h-4.5 text-indigo-400" />
                            </div>
                            <div>
                                <span className="text-white font-semibold text-[15px] block">Dark Mode</span>
                                <span className="text-[10px] text-slate-400 font-medium">Default enabled for now</span>
                            </div>
                        </div>
                        <div className="w-12 h-7 rounded-full bg-teal-500 relative border border-teal-400">
                            <div className="absolute top-[2px] right-[2px] w-5 h-5 bg-white rounded-full shadow-md" />
                        </div>
                    </div>

                    {}
                    <motion.div whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }} className="p-5 flex items-center justify-between cursor-pointer transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-500/15 flex items-center justify-center border border-slate-500/20">
                                <Settings className="w-4.5 h-4.5 text-slate-400" />
                            </div>
                            <span className="text-white font-semibold text-[15px]">Advanced Settings</span>
                        </div>
                        <ChevronRight className="w-4.5 h-4.5 text-slate-500" />
                    </motion.div>
                </div>
            </motion.section>

            {}
            <motion.div variants={itemVariants}>
                <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(244,63,94,0.1)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearMadhab}
                    className="w-full glass-premium rounded-2xl border border-rose-500/30 p-4.5 flex items-center justify-center gap-2.5 text-rose-400 transition-all shadow-lg shadow-rose-500/5 group"
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-[15px] tracking-wide">Reset Onboarding</span>
                </motion.button>
            </motion.div>

            {}
            <motion.p variants={itemVariants} className="text-center text-[11px] font-bold tracking-widest uppercase text-slate-600 mt-10">
                Islam101 v1.0.0 • Premium
            </motion.p>
        </motion.div>
    );
};

export default Profile;

