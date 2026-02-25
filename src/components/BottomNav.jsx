import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, ScanLine, CalendarClock, MessageCircleHeart, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Scanner', path: '/scanner', icon: ScanLine },
        { name: 'Scheduler', path: '/scheduler', icon: CalendarClock },
        { name: 'Hujra', path: '/hujra', icon: MessageCircleHeart },
        { name: 'Profile', path: '/profile', icon: UserRound },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50">
            {}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/80 to-transparent pointer-events-none -top-16" />

            <div className="relative glass-premium border-t border-white/[0.08] px-2 pb-6 pt-3">
                <div className="flex justify-around items-center max-w-md mx-auto relative relative z-10">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <motion.button
                                key={item.name}
                                onClick={() => navigate(item.path)}
                                whileTap={{ scale: 0.85 }}
                                className="flex flex-col items-center gap-1.5 p-2 relative flex-1"
                            >
                                {}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute inset-0 bg-white/[0.08] border border-white/[0.05] rounded-2xl"
                                        transition={{
                                            type: 'spring',
                                            stiffness: 400,
                                            damping: 25,
                                            mass: 0.8
                                        }}
                                    />
                                )}

                                <div className="relative z-10 transition-transform duration-300">
                                    <Icon
                                        size={22}
                                        strokeWidth={isActive ? 2.5 : 1.8}
                                        className={`transition-all duration-300 ${isActive ? 'text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]' : 'text-slate-500'
                                            }`}
                                    />
                                </div>

                                {}
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default BottomNav;

