import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useMadhabStore } from './store/useMadhabStore';



import Onboarding from './components/Onboarding';
import BottomNav from './components/BottomNav';
import AmbientBackground from './components/AmbientBackground';



import Home from './pages/Home';
import Scanner from './pages/Scanner';
import Scheduler from './pages/Scheduler';
import Hujra from './pages/Hujra';
import Profile from './pages/Profile';
import Solutions from './pages/Solutions';


const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  type: 'tween',
  duration: 0.2,
  ease: 'easeOut',
};


function AnimatedRoutes() {
  const location = useLocation();


  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="min-h-screen">
            <Home />
          </motion.div>
        } />
        <Route path="/scanner" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="min-h-screen">
            <Scanner />
          </motion.div>
        } />
        <Route path="/scheduler" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="min-h-screen">
            <Scheduler />
          </motion.div>
        } />
        <Route path="/hujra" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="min-h-screen">
            <Hujra />
          </motion.div>
        } />
        <Route path="/profile" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="min-h-screen">
            <Profile />
          </motion.div>
        } />
        <Route path="/solutions" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="min-h-screen">
            <Solutions />
          </motion.div>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}


function App() {
  const madhab = useMadhabStore((state) => state.selectedMadhab);


  return (
    <Router>
      { }
      <div className="font-sans min-h-screen relative bg-[#070b14] text-slate-100">
        <AmbientBackground />


        <div className="relative z-10 w-full min-h-[100dvh]">
          <AnimatePresence mode="wait">
            {!madhab ? (
              <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <Onboarding />
              </motion.div>
            ) : (
              <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <AnimatedRoutes />
                <BottomNav />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Router>
  );
}


export default App;

