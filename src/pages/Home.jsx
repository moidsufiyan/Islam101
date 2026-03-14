import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMadhabStore } from '../store/useMadhabStore';
import { useScheduleStore } from '../store/useScheduleStore';
import { BookOpen, Heart, Sparkles, Clock, Sun, Sunset, Moon, CloudSun, MoonStar, ChevronRight, Search } from 'lucide-react';

const emotions = [
    { id: 'anxious', emoji: '😟', label: 'Anxious', color: 'from-blue-500/30 to-indigo-500/10', border: 'border-blue-500/30', accent: 'text-blue-300' },
    { id: 'joyful', emoji: '😊', label: 'Joyful', color: 'from-emerald-500/30 to-teal-500/10', border: 'border-emerald-500/30', accent: 'text-emerald-300' },
    { id: 'ungrateful', emoji: '😒', label: 'Ungrateful', color: 'from-amber-500/30 to-orange-500/10', border: 'border-amber-500/30', accent: 'text-amber-300' },
    { id: 'lonely', emoji: '😢', label: 'Lonely', color: 'from-violet-500/30 to-purple-500/10', border: 'border-violet-500/30', accent: 'text-violet-300' },
    { id: 'angry', emoji: '😤', label: 'Angry', color: 'from-rose-500/30 to-red-500/10', border: 'border-rose-500/30', accent: 'text-rose-300' },
];

const contentMap = {
    anxious: {
        title: 'Find Peace Within',
        text: 'Recite Surah Ash-Sharh (94) three times. Focus on the verse: "Indeed, with hardship comes ease."',
        icon: '🤲',
        dua: 'اللهم إني أعوذ بك من الهم والحزن',
        duaTrans: "O Allah, I seek refuge in You from worry and grief.",
    },
    joyful: {
        title: 'Express Gratitude',
        text: "Say 'Alhamdulillah' and consider giving a small charity today. Share your blessing.",
        icon: '🌟',
        dua: 'الحمد لله رب العالمين',
        duaTrans: "All praise is due to Allah, Lord of all the worlds.",
    },
    ungrateful: {
        title: 'Reflect & Return',
        text: 'Read Surah Ar-Rahman (55) and reflect on His countless favors upon you.',
        icon: '🌿',
        dua: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ',
        duaTrans: "My Lord, enable me to be grateful for Your favor.",
    },
    lonely: {
        title: 'You Are Never Alone',
        text: "Remember: Allah is closer to you than your jugular vein. (Quran 50:16). Talk to Him.",
        icon: '💙',
        dua: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ',
        duaTrans: "And He is with you wherever you are.",
    },
    angry: {
        title: 'Cool the Fire',
        text: "The Prophet ﷺ said: 'If you are angry, sit down. If still angry, lie down.' Seek Wudu—it extinguishes anger.",
        icon: '🕊️',
        dua: 'أعوذ بالله من الشيطان الرجيم',
        duaTrans: "I seek refuge in Allah from the accursed Satan.",
    },
};

const prayerIcons = {
    Fajr: Sun,
    Dhuhr: CloudSun,
    Asr: Sunset,
    Maghrib: Moon,
    Isha: MoonStar,
};

const formatTime = (t) => {
    if (!t) return '';
    const clean = t.replace(/ \(.*\)/, '');
    const [h, m] = clean.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
};

const springTransition = { type: 'tween', duration: 0.25, ease: 'easeOut' };

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: springTransition }
};

const Home = () => {
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const userName = useMadhabStore((state) => state.userName);
    const navigate = useNavigate();

    const apiTimes = useScheduleStore((state) => state.prayerTimes);
    const city = useScheduleStore((state) => state.city);
    const refreshPrayerTimes = useScheduleStore((state) => state.refreshPrayerTimes);

    useEffect(() => {
        if (city && !apiTimes) {
            refreshPrayerTimes();
        }
    }, [city, apiTimes, refreshPrayerTimes]);

    const currentDate = new Date();
    const hour = currentDate.getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
    const strDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const prayerTimes = apiTimes
        ? [
            { name: 'Fajr', time: formatTime(apiTimes.Fajr), passed: hour >= parseInt(apiTimes.Fajr) + 1 },
            { name: 'Dhuhr', time: formatTime(apiTimes.Dhuhr), passed: hour >= parseInt(apiTimes.Asr) },
            { name: 'Asr', time: formatTime(apiTimes.Asr), passed: hour >= parseInt(apiTimes.Maghrib) },
            { name: 'Maghrib', time: formatTime(apiTimes.Maghrib), passed: hour >= parseInt(apiTimes.Isha) },
            { name: 'Isha', time: formatTime(apiTimes.Isha), passed: hour >= 23 },
        ]
        : [
            { name: 'Fajr', time: '05:32 AM', passed: hour >= 6 },
            { name: 'Dhuhr', time: '12:45 PM', passed: hour >= 13 },
            { name: 'Asr', time: '04:12 PM', passed: hour >= 17 },
            { name: 'Maghrib', time: '06:38 PM', passed: hour >= 19 },
            { name: 'Isha', time: '07:55 PM', passed: hour >= 21 },
        ];

    const nextPrayer = prayerTimes.find(p => !p.passed) || prayerTimes[0];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="pb-32 pt-10 px-5 min-h-screen relative"
        >
            {}
            <motion.header variants={itemVariants} className="mb-10 relative z-10">
                <p className="text-teal-300/80 text-sm font-semibold tracking-wide uppercase mb-2">{greeting}</p>
                <h1 className="text-4xl font-bold tracking-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400">{userName}</span>
                    <span className="text-3xl ml-2 inline-block animate-float-delayed origin-bottom">👋</span>
                </h1>
            </motion.header>

            {}
            <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="glass-premium border-t border-teal-500/20 rounded-3xl p-5 mb-8 flex items-center justify-between shadow-[0_8px_30px_rgba(20,184,166,0.1)] group relative overflow-hidden"
            >
                {}
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 group-hover:bg-teal-400/30 transition-colors" />

                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center border border-teal-400/30">
                        <Clock className="w-6 h-6 text-teal-300 drop-shadow-lg" />
                    </div>
                    <div>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Next Prayer</p>
                        <p className="text-white text-lg font-bold tracking-tight shadow-black drop-shadow-md">{nextPrayer.name}</p>
                    </div>
                </div>
                <div className="text-right relative z-10">
                    <p className="text-teal-300 font-black text-2xl tracking-tighter drop-shadow-md">{nextPrayer.time.split(' ')[0]}</p>
                    <p className="text-xs text-teal-400/80 font-bold uppercase">{nextPrayer.time.split(' ')[1]}</p>
                </div>
            </motion.div>

            {}
            <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/solutions')}
                className="glass-premium rounded-3xl p-4 mb-10 flex items-center justify-between cursor-pointer group shadow-lg drop-shadow relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-transparent -translate-x-full group-hover:animate-shimmer transition-all" />
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center border border-violet-400/20 group-hover:scale-110 transition-transform">
                        <Search className="w-6 h-6 text-violet-300" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-base tracking-tight mb-0.5">Solutions by Belief</p>
                        <p className="text-[11px] font-medium text-slate-400">Authentic guidance from the Quran & Sunnah</p>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors relative z-10" />
            </motion.div>

            {}
            <motion.section variants={itemVariants} className="mb-10">
                <div className="flex items-center gap-2 mb-5">
                    <Heart className="w-5 h-5 text-rose-400 animate-pulse-slow" />
                    <h2 className="text-xl font-bold text-white tracking-tight">State of Heart</h2>
                </div>

                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-3 -mx-2 px-2">
                    {emotions.map((emotion) => {
                        const isSelected = selectedEmotion === emotion.id;
                        return (
                            <motion.button
                                key={emotion.id}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedEmotion(isSelected ? null : emotion.id)}
                                className={`flex-none flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 ${isSelected
                                        ? `bg-white/[0.12] border-${emotion.border.split('-')[1]}-500/50 shadow-[0_0_15px_rgba(255,255,255,0.1)]`
                                        : 'glass-premium border-white/[0.04] text-slate-400'
                                    }`}
                            >
                                <motion.span
                                    className="text-xl relative"
                                    animate={isSelected ? { rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] } : {}}
                                    transition={{ duration: 0.5 }}
                                >
                                    {emotion.emoji}
                                </motion.span>
                                <span className={`font-semibold text-sm ${isSelected ? 'text-white' : ''}`}>
                                    {emotion.label}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>

                {}
                <AnimatePresence mode="wait">
                    {selectedEmotion && contentMap[selectedEmotion] && (
                        <motion.div
                            key={selectedEmotion}
                            initial={{ opacity: 0, height: 0, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
                            exit={{ opacity: 0, height: 0, filter: 'blur(10px)', transition: { duration: 0.2 } }}
                            transition={springTransition}
                            className="mt-4 overflow-hidden"
                        >
                            <div className={`rounded-3xl border border-white/10 bg-gradient-to-br ${emotions.find(e => e.id === selectedEmotion).color} p-6 relative backdrop-blur-3xl shadow-2xl`}>
                                <div className="absolute -top-4 -right-4 text-6xl opacity-20 blur-sm mix-blend-overlay">{contentMap[selectedEmotion].icon}</div>
                                <h3 className={`font-bold text-xl mb-3 pr-8 ${emotions.find(e => e.id === selectedEmotion).accent}`}>
                                    {contentMap[selectedEmotion].title}
                                </h3>
                                <p className="text-slate-200 text-sm leading-relaxed mb-6 font-medium">
                                    {contentMap[selectedEmotion].text}
                                </p>
                                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                                    <p className={`font-serif text-xl text-right mb-2 leading-relaxed ${emotions.find(e => e.id === selectedEmotion).accent}`} dir="rtl">
                                        {contentMap[selectedEmotion].dua}
                                    </p>
                                    <p className="text-xs text-slate-400 italic">
                                        {contentMap[selectedEmotion].duaTrans}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.section>

            {}
            <motion.section variants={itemVariants} className="mb-10">
                <div className="flex items-center gap-2 mb-5">
                    <BookOpen className="w-5 h-5 text-teal-400" />
                    <h2 className="text-xl font-bold text-white tracking-tight">Verse of the Day</h2>
                </div>
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="glass-premium rounded-3xl p-6 relative overflow-hidden"
                >
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl" />
                    <p className="font-serif text-2xl text-teal-300 text-right mb-4 leading-loose drop-shadow" dir="rtl">
                        وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ
                    </p>
                    <p className="text-slate-200 text-sm leading-relaxed italic mb-2 font-medium">
                        "And whoever puts their trust in Allah — He will be enough for them."
                    </p>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">— Surah At-Talaq (65:3)</p>
                </motion.div>
            </motion.section>

            {}
            <motion.section variants={itemVariants}>
                <div className="flex items-end justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-teal-400" />
                        <h2 className="text-xl font-bold text-white tracking-tight">Timeline</h2>
                    </div>
                    <span className="text-[10px] font-bold tracking-widest text-teal-400 bg-teal-500/10 px-3 py-1.5 rounded-full uppercase border border-teal-500/20">
                        {strDate.split(', ')[1]}
                    </span>
                </div>

                <div className="glass-premium rounded-3xl p-3">
                    <div className="space-y-1">
                        {prayerTimes.map((prayer) => {
                            const Icon = prayerIcons[prayer.name];
                            const isNext = prayer.name === nextPrayer.name;
                            return (
                                <motion.div
                                    key={prayer.name}
                                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.03)' }}
                                    className={`flex justify-between items-center p-3 rounded-2xl transition-colors ${isNext ? 'bg-teal-500/[0.08] border border-teal-500/20' : ''}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isNext ? 'bg-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.2)]' : prayer.passed ? 'bg-white/[0.03]' : 'bg-white/[0.05]'
                                            }`}>
                                            <Icon className={`w-5 h-5 ${isNext ? 'text-teal-300' : prayer.passed ? 'text-slate-600' : 'text-slate-400'
                                                }`} />
                                        </div>
                                        <span className={`text-base font-bold tracking-tight ${isNext ? 'text-teal-300' : prayer.passed ? 'text-slate-600 line-through' : 'text-slate-200'
                                            }`}>
                                            {prayer.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-base font-bold tracking-tight ${isNext ? 'text-teal-300 drop-shadow' : prayer.passed ? 'text-slate-600' : 'text-slate-300'
                                            }`}>
                                            {prayer.time}
                                        </span>
                                        {isNext && (
                                            <span className="text-[9px] font-black bg-teal-500 text-teal-50 px-2 py-1 rounded-md uppercase tracking-widest shadow-lg shadow-teal-500/30">Next</span>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.section>
        </motion.div>
    );
};

export default Home;

