import React from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Users, 
  BookOpen, 
  Play, 
  Settings, 
  ChevronLeft,
  Car,
  CarFront,
  Bike,
  Bus,
  Truck,
  Skull,
  ArrowRight,
  Plus,
  Minus,
  Star,
  Zap,
  Info,
  Caravan
} from 'lucide-react';

export const IconMap = {
  Trophy,
  Users,
  BookOpen,
  Play,
  Settings,
  ChevronLeft,
  Car,
  CarFront,
  Bike,
  Bus,
  Truck,
  Skull,
  ArrowRight,
  Plus,
  Minus,
  Star,
  Zap,
  Info,
  Caravan
};

export const Ticker = ({ items }: { items: string[] }) => (
  <div className="w-full overflow-hidden bg-surface-container-lowest/40 backdrop-blur-md py-2 border-y border-outline-variant/5">
    <div className="flex whitespace-nowrap gap-12 animate-marquee">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            {item}
          </span>
        </div>
      ))}
      {/* Duplicate for seamless loop */}
      {items.map((item, i) => (
        <div key={`dup-${i}`} className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            {item}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const BottomNav = ({ active, onNavigate }: { active: string, onNavigate: (s: any) => void }) => (
  <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-8 pt-4 bg-background/60 backdrop-blur-xl z-50 rounded-t-[2.5rem] shadow-[0_-4px_32px_rgba(229,227,255,0.06)]">
    <button 
      onClick={() => onNavigate('home')}
      className={`flex flex-col items-center justify-center px-5 py-2 transition-all duration-300 ${active === 'home' ? 'bg-primary text-background rounded-full' : 'text-tertiary'}`}
    >
      <Play size={24} fill={active === 'home' ? 'currentColor' : 'none'} />
      <span className="font-body text-[10px] font-bold uppercase mt-1">Play</span>
    </button>
    <button 
      onClick={() => onNavigate('setup-squad')}
      className={`flex flex-col items-center justify-center px-5 py-2 transition-all duration-300 ${active === 'setup-squad' ? 'bg-primary text-background rounded-full' : 'text-tertiary'}`}
    >
      <Users size={24} fill={active === 'setup-squad' ? 'currentColor' : 'none'} />
      <span className="font-body text-[10px] font-bold uppercase mt-1">Teams</span>
    </button>
    <button 
      onClick={() => onNavigate('leaderboard')}
      className={`flex flex-col items-center justify-center px-5 py-2 transition-all duration-300 ${active === 'leaderboard' ? 'bg-primary text-background rounded-full' : 'text-tertiary'}`}
    >
      <Trophy size={24} fill={active === 'leaderboard' ? 'currentColor' : 'none'} />
      <span className="font-body text-[10px] font-bold uppercase mt-1">Stats</span>
    </button>
    <button 
      onClick={() => onNavigate('rules')}
      className={`flex flex-col items-center justify-center px-5 py-2 transition-all duration-300 ${active === 'rules' ? 'bg-primary text-background rounded-full' : 'text-tertiary'}`}
    >
      <BookOpen size={24} fill={active === 'rules' ? 'currentColor' : 'none'} />
      <span className="font-body text-[10px] font-bold uppercase mt-1">Rules</span>
    </button>
  </nav>
);
