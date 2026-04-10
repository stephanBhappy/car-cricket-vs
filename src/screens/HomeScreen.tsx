import { motion } from 'motion/react';
import { Play, BookOpen } from 'lucide-react';
import { Screen } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <motion.main
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pb-32 pt-20"
    >
      <div className="fixed inset-0 z-0">
        <img
          src="/bg.jpg"
          alt="Background"
          fetchPriority="high"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <div className="w-full bg-surface-container-lowest/40 backdrop-blur-md rounded-full py-2 px-6 mb-12 border border-outline-variant/10">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Road Trip Cricket • Spot Cars, Score Runs
            </span>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="font-headline text-[3.5rem] md:text-[5rem] font-black leading-[0.85] tracking-tighter italic text-primary uppercase text-glow mb-2">
            TARMAC20
          </h2>
          <p className="font-body text-secondary font-extrabold tracking-[0.4em] text-sm uppercase">
            The Asphalt League
          </p>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-4">
          <button
            onClick={() => onNavigate('setup-squad')}
            className="h-20 w-full rounded-full bg-gradient-to-r from-primary to-primary-container flex items-center justify-center active:scale-95 transition-all shadow-[0_12px_40px_-12px_rgba(205,255,96,0.3)]"
          >
            <div className="flex items-center gap-3">
              <span className="font-headline font-black text-2xl text-on-primary tracking-tighter">START GAME</span>
              <Play size={24} fill="currentColor" className="text-on-primary" />
            </div>
          </button>
          <button
            onClick={() => onNavigate('rules')}
            className="h-16 w-full rounded-full bg-surface-container-highest border border-secondary/20 flex items-center justify-center active:scale-95 transition-all group"
          >
            <div className="flex items-center gap-3">
              <span className="font-headline font-bold text-lg text-secondary tracking-tight uppercase">RULES & HANDBOOK</span>
              <BookOpen size={20} className="text-secondary" />
            </div>
          </button>
        </div>
      </div>
    </motion.main>
  );
}
