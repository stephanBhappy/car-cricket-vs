import { motion } from 'motion/react';
import { Users, ArrowRight } from 'lucide-react';
import { GameState, Screen } from '../types';

interface SetupSquadScreenProps {
  gameState: GameState;
  onSetPlayerCount: (count: number) => void;
  onUpdatePlayerName: (index: number, name: string) => void;
  onNavigate: (screen: Screen) => void;
}

export default function SetupSquadScreen({ gameState, onSetPlayerCount, onUpdatePlayerName, onNavigate }: SetupSquadScreenProps) {
  return (
    <motion.main
      key="setup-squad"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="pt-24 pb-32 px-6 max-w-2xl mx-auto"
    >
      <section className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-container-low border border-outline-variant/20 mb-4 shadow-inner">
          <Users size={32} className="text-primary" />
        </div>
        <h2 className="font-headline text-5xl font-black italic tracking-tighter text-on-surface uppercase mb-2">Build Your Squad</h2>
        <p className="text-on-surface-variant font-body text-sm uppercase tracking-widest opacity-70">Setup Players for the Journey</p>
      </section>

      <section className="mb-12 max-w-md mx-auto w-full">
        <label className="font-body text-[10px] font-black text-tertiary uppercase tracking-[0.2em] mb-4 block text-center opacity-80">Number of Players</label>
        <div className="bg-surface-container-low p-1 rounded-2xl grid grid-cols-6 gap-1 border border-outline-variant/20 shadow-inner">
          {[1, 2, 3, 4, 5, 6].map(count => (
            <button
              key={count}
              onClick={() => onSetPlayerCount(count)}
              className={`h-11 rounded-xl flex items-center justify-center font-headline font-black transition-all duration-500 relative ${gameState.players.length === count ? 'bg-primary text-on-primary shadow-[0_4px_20px_rgba(205,255,96,0.3)] z-10 scale-[1.05]' : 'bg-transparent text-on-surface-variant hover:bg-surface-container-high/40'}`}
            >
              {gameState.players.length === count && (
                <motion.div
                  layoutId="activePlayerCount"
                  className="absolute inset-0 bg-primary rounded-xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-20">{count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {gameState.players.map((player, i) => (
          <motion.div layout key={player.id} className="relative group">
            <div className="relative bg-surface-container-low p-5 rounded-2xl flex items-center gap-4 border border-outline-variant/10 hover:border-primary/30 transition-colors shadow-sm">
              <div className="w-12 h-12 bg-surface-container-highest rounded-xl flex items-center justify-center shadow-inner">
                <span className={`font-headline font-black text-xl ${i % 2 === 0 ? 'text-primary' : 'text-secondary'}`}>P{i + 1}</span>
              </div>
              <div className="flex-1">
                <label className={`block text-[10px] font-bold uppercase tracking-[0.1em] mb-1 ${i % 2 === 0 ? 'text-tertiary' : 'text-secondary'} opacity-80`}>
                  {gameState.players.length === 1 ? 'Solo Mode' : (['Opener', 'No. 2', 'No. 3', 'Middle Order', 'Lower Order', 'Last Man'][i] ?? 'Substitute')}
                </label>
                <input
                  className="w-full bg-transparent border-none p-0 text-lg font-headline font-bold text-on-surface focus:ring-0 placeholder:text-on-surface-variant/30"
                  value={player.name}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => onUpdatePlayerName(i, e.target.value.toUpperCase())}
                  placeholder="Enter name..."
                />
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="mt-10 w-full max-w-md mx-auto">
        <button
          onClick={() => onNavigate('setup-innings')}
          className="w-full h-16 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-black text-xl italic tracking-tighter shadow-[0_12px_48px_rgba(205,255,96,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 uppercase"
        >
          Next Step
          <ArrowRight size={24} />
        </button>
      </div>
    </motion.main>
  );
}
