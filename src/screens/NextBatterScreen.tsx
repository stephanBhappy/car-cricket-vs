import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import { Ticker } from '../components/Common';
import { GameState, Player, Screen } from '../types';

interface NextBatterScreenProps {
  gameState: GameState;
  currentBatter: Player;
  onNavigate: (screen: Screen) => void;
}

export default function NextBatterScreen({ gameState, currentBatter, onNavigate }: NextBatterScreenProps) {
  return (
    <motion.main
      key="next-batter"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.1, opacity: 0 }}
      className="flex-grow flex flex-col items-center justify-center px-6 pt-16 pb-32 relative min-h-screen"
    >
      <div className="w-full max-w-md z-10 flex flex-col items-center">
        <div className="mb-8 px-4 py-1.5 bg-surface-container-high rounded-full border border-outline-variant/15 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="font-body text-xs font-bold uppercase tracking-widest text-on-surface-variant">Inning {gameState.currentInning} of {gameState.totalInnings}</span>
        </div>

        <div className="glass-panel w-full p-8 rounded-lg border border-outline-variant/10 text-center relative overflow-hidden mb-12">
          <h2 className="font-headline text-on-surface-variant text-lg font-bold uppercase tracking-tighter mb-2">Next Batter</h2>
          <div className="flex flex-col items-center py-4">
            <span className="font-headline text-5xl md:text-6xl font-black text-primary tracking-tighter italic uppercase leading-none drop-shadow-sm">{currentBatter.name}</span>
            <div className="mt-4 flex gap-4">
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-widest">Balls Faced</span>
                <span className="font-headline text-xl font-bold">{currentBatter.ballsFaced}</span>
              </div>
              <div className="w-px h-8 bg-outline-variant/20"></div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-widest">Rank</span>
                <span className="font-headline text-xl font-bold">
                  #{String([...gameState.players].sort((a, b) => (b.totalRuns + b.runs) - (a.totalRuns + a.runs)).findIndex(p => p.id === currentBatter.id) + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-4">
          <button
            onClick={() => onNavigate('game')}
            className="group relative w-full bg-gradient-to-b from-primary to-primary-container h-16 rounded-full flex items-center justify-center gap-3 active:scale-95 transition-all duration-300 shadow-[0_8px_32px_rgba(205,255,96,0.2)]"
          >
            <span className="font-headline text-on-primary text-xl font-black uppercase tracking-tighter">START BAT</span>
            <Play size={24} fill="currentColor" className="text-on-primary" />
          </button>
          <p className="font-body text-xs text-on-surface-variant/60 uppercase font-bold tracking-widest">
            {gameState.currentBatterIndex === 0 && gameState.currentInning === 1
              ? 'Get ready for the first delivery'
              : "You're up next"}
          </p>
        </div>
      </div>
      <div className="fixed bottom-28 w-full">
        <Ticker items={(() => {
          const leader = [...gameState.players].sort((a, b) => (b.totalRuns + b.runs) - (a.totalRuns + a.runs))[0];
          const items = [
            `INNING ${gameState.currentInning} OF ${gameState.totalInnings} • ${gameState.players.length} PLAYER${gameState.players.length > 1 ? 'S' : ''}`,
            `UP NEXT: ${currentBatter.name}`,
            `LEADER: ${leader.name} WITH ${leader.totalRuns + leader.runs} RUNS`,
          ];
          if (gameState.history.length > 0) {
            items.push(`LAST BALL: +${gameState.history[0]} RUN${gameState.history[0] !== 1 ? 'S' : ''}`);
          }
          if (currentBatter.totalRuns + currentBatter.runs > 0) {
            items.push(`${currentBatter.name} HAS ${currentBatter.totalRuns + currentBatter.runs} TOTAL RUNS`);
          }
          return items;
        })()} />
      </div>
    </motion.main>
  );
}
