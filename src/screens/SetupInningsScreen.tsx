import { motion } from 'motion/react';
import { Star, Minus, Plus, Play } from 'lucide-react';
import { GameState, Screen } from '../types';

interface SetupInningsScreenProps {
  gameState: GameState;
  showCustomInnings: boolean;
  onSelectPreset: (val: number) => void;
  onEnableCustom: () => void;
  onAdjustCustom: (delta: number) => void;
  onNavigate: (screen: Screen) => void;
}

export default function SetupInningsScreen({
  gameState,
  showCustomInnings,
  onSelectPreset,
  onEnableCustom,
  onAdjustCustom,
  onNavigate,
}: SetupInningsScreenProps) {
  return (
    <motion.main
      key="setup-innings"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="pt-24 pb-32 px-6 min-h-screen flex flex-col items-center"
    >
      <div className="w-full mb-10 text-center">
        <p className="font-body text-tertiary text-sm font-bold uppercase tracking-widest mb-2">Game Setup</p>
        <h2 className="font-headline text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4">
          CHOOSE YOUR<br /><span className="text-primary italic">INNINGS</span>
        </h2>
        <p className="text-on-surface-variant max-w-[280px] mx-auto text-sm">How many rounds will each player face before the tournament ends?</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {[
          { val: 1, label: 'Quick Fire' },
          { val: 2, label: 'Standard' },
          { val: 3, label: 'Classic' },
        ].map(opt => (
          <button
            key={opt.val}
            onClick={() => onSelectPreset(opt.val)}
            className={`group relative flex flex-col items-center justify-center p-8 rounded-lg transition-all duration-300 active:scale-95 ${!showCustomInnings && gameState.totalInnings === opt.val ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'}`}
          >
            {!showCustomInnings && gameState.totalInnings === opt.val && (
              <div className="absolute top-3 right-3">
                <Star size={16} fill="currentColor" />
              </div>
            )}
            <span className={`font-headline text-5xl font-black ${!showCustomInnings && gameState.totalInnings === opt.val ? 'italic' : ''}`}>{opt.val}</span>
            <span className={`font-body text-[10px] font-bold uppercase tracking-widest mt-2 ${!showCustomInnings && gameState.totalInnings === opt.val ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>{opt.label}</span>
          </button>
        ))}

        <button
          onClick={onEnableCustom}
          className={`group relative flex flex-col items-center justify-center p-8 rounded-lg transition-all duration-300 active:scale-95 ${showCustomInnings ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'}`}
        >
          {showCustomInnings && (
            <div className="absolute top-3 right-3">
              <Star size={16} fill="currentColor" />
            </div>
          )}
          <span className={`font-headline text-5xl font-black ${showCustomInnings ? 'italic' : ''}`}>?</span>
          <span className={`font-body text-[10px] font-bold uppercase tracking-widest mt-2 ${showCustomInnings ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>Custom</span>
        </button>

        {showCustomInnings && (
          <div className="col-span-2 mt-2">
            <div className="bg-surface-container-low p-6 rounded-lg flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-body text-xs font-bold uppercase text-tertiary mb-1">Custom Series</span>
                <span className="font-headline text-2xl font-black text-on-surface">SET ROUNDS</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  aria-label="Decrease innings"
                  onClick={() => onAdjustCustom(-1)}
                  className="w-10 h-10 rounded-md bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-90"
                >
                  <Minus size={20} />
                </button>
                <span className="font-headline text-3xl font-black w-8 text-center">{gameState.totalInnings}</span>
                <button
                  aria-label="Increase innings"
                  onClick={() => onAdjustCustom(1)}
                  className="w-10 h-10 rounded-md bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-90"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 w-full max-w-md mx-auto">
        <button
          onClick={() => onNavigate('next-batter')}
          className="w-full h-16 rounded-full bg-gradient-to-r from-primary to-primary-container flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_12px_40px_rgba(205,255,96,0.15)] group"
        >
          <span className="font-headline text-lg font-black text-on-primary uppercase tracking-tight">START GAME</span>
          <Play size={20} fill="currentColor" className="text-on-primary" />
        </button>
      </div>
    </motion.main>
  );
}
