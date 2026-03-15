import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMadhabStore } from '../store/useMadhabStore';
import { useAuthStore } from '../store/useAuthStore';
import { Sparkles, ChevronRight, Loader2, Mail, Lock, User, AlertCircle } from 'lucide-react';

const springTransition = { type: 'spring', stiffness: 300, damping: 24, mass: 0.8 };

const Onboarding = () => {
    // step 0 = welcome, step 1 = register/login form
    const [step, setStep] = useState(0);
    const [isLoginMode, setIsLoginMode] = useState(false);

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');

    const completeOnboarding = useMadhabStore((state) => state.completeOnboarding);
    const setUserName = useMadhabStore((state) => state.setUserName);
    const { register, login, isLoading } = useAuthStore();

    const handleAuthSubmit = async () => {
        setFormError('');

        if (isLoginMode) {
            if (!email.trim() || !password.trim()) {
                setFormError('Please fill in all fields.');
                return;
            }
            const result = await login(email.trim(), password.trim());
            if (result.success) {
                completeOnboarding();
            } else {
                setFormError(result.message || 'Login failed.');
            }
        } else {
            if (!name.trim() || !email.trim() || !password.trim()) {
                setFormError('Please fill in all fields.');
                return;
            }
            if (password.length < 6) {
                setFormError('Password must be at least 6 characters.');
                return;
            }
            const result = await register(name.trim(), email.trim(), password.trim());
            if (result.success) {
                setUserName(name.trim());
                completeOnboarding();
            } else {
                setFormError(result.message || 'Registration failed.');
            }
        }
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
                            className="text-slate-400 text-base mb-4 leading-relaxed"
                        >
                            Your personal spiritual companion.<br />
                            Built with love, sealed with purpose.
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-teal-400/60 text-xs mb-12 font-medium"
                        >
                            لَا إِلٰهَ إِلَّا ٱللَّٰهُ — One God, One Ummah
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
                    /* ── STEP 1: Register / Login ─────────────────────────────── */
                    <motion.div
                        key="auth"
                        initial={{ opacity: 0, y: 30, scale: 0.95, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -30, scale: 0.95, filter: 'blur(8px)' }}
                        transition={springTransition}
                        className="max-w-sm w-full relative z-10"
                    >
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, ...springTransition }}
                                className="inline-flex items-center gap-2 text-teal-400 bg-teal-500/10 px-3 py-1.5 rounded-full text-xs font-medium mb-4 border border-teal-500/20"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                {isLoginMode ? 'Welcome Back' : 'Create Account'}
                            </motion.div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                {isLoginMode ? 'Sign In' : 'Join Islam101'}
                            </h1>
                            <p className="text-slate-400 text-sm">
                                {isLoginMode ? 'Continue your spiritual journey.' : 'Your data syncs across devices.'}
                            </p>
                        </div>

                        <div className="space-y-4 mb-6">
                            {/* Name field — only shown for Register */}
                            {!isLoginMode && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="relative"
                                >
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all font-medium"
                                    />
                                </motion.div>
                            )}

                            {/* Email field */}
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all font-medium"
                                />
                            </div>

                            {/* Password field */}
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="password"
                                    placeholder="Password (min 6 chars)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAuthSubmit()}
                                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* Error message */}
                        <AnimatePresence>
                            {formError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="flex items-center gap-2 mb-4 text-rose-400 text-xs font-semibold bg-rose-500/10 px-4 py-3 rounded-xl border border-rose-500/20"
                                >
                                    <AlertCircle className="w-4 h-4 flex-none" />
                                    {formError}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleAuthSubmit}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold py-4 rounded-2xl shadow-[0_0_30px_rgba(20,184,166,0.25)] flex items-center justify-center gap-2 text-base border border-teal-400/30 disabled:opacity-50 transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {isLoginMode ? 'Signing in...' : 'Creating account...'}
                                </>
                            ) : (
                                <>
                                    {isLoginMode ? 'Sign In' : 'Create Account'}
                                    <ChevronRight className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>

                        {/* Toggle login/register */}
                        <p className="text-center text-slate-500 text-sm mt-6">
                            {isLoginMode ? "Don't have an account? " : 'Already have an account? '}
                            <button
                                onClick={() => { setIsLoginMode(!isLoginMode); setFormError(''); }}
                                className="text-teal-400 font-semibold hover:underline"
                            >
                                {isLoginMode ? 'Register' : 'Sign In'}
                            </button>
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Onboarding;
