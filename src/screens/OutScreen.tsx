import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { GameState, Player } from '../types';

interface OutScreenProps {
  gameState: GameState;
  currentBatter: Player;
  onNextPlayer: () => void;
  onEndGame: () => void;
}

export default function OutScreen({ gameState, currentBatter, onNextPlayer, onEndGame }: OutScreenProps) {
  return (
    <motion.main
      key="out"
      initial={{ scale: 1.2, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-16 pb-32 flex flex-col items-center justify-center relative overflow-hidden"
    >
      <div className="relative z-10 w-full px-6 flex flex-col items-center text-center">
        <div className="mb-2">
          <span className="font-headline font-black text-[8rem] md:text-[10rem] leading-none text-secondary tracking-tighter italic uppercase text-glow-secondary block">
            OUT!
          </span>
        </div>

        <div className="w-full max-w-md bg-surface-container-low rounded-lg p-6 mb-12 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex justify-between items-end border-b border-outline-variant/20 pb-4">
              <div className="text-left">
                <p className="text-on-surface-variant font-body text-xs uppercase tracking-widest mb-1">Last Batter</p>
                <h2 className="font-headline font-bold text-2xl text-on-surface">{currentBatter.name}</h2>
              </div>
              <div className="text-right">
                <p className="text-secondary font-headline font-black text-4xl">{currentBatter.runs}</p>
                <p className="text-on-surface-variant font-body text-[10px] uppercase">This Inning</p>
                {currentBatter.totalRuns > 0 && (
                  <p className="text-primary font-headline font-bold text-sm">{currentBatter.totalRuns + currentBatter.runs} Total</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-surface-container-high rounded p-3 text-left">
                <p className="text-on-surface-variant font-body text-[10px] uppercase">Wicket Type</p>
                <p className="text-on-surface font-bold text-sm">{currentBatter.dismissalType}</p>
              </div>
              <div className="bg-surface-container-high rounded p-3 text-left">
                <p className="text-on-surface-variant font-body text-[10px] uppercase">Balls Faced</p>
                <p className="text-on-surface font-bold text-sm">{currentBatter.ballsFaced}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-4">
          <button
            onClick={onNextPlayer}
            className="h-16 w-full bg-gradient-to-r from-primary to-primary-container rounded-full flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg"
          >
            <span className="font-headline font-black text-on-primary text-xl uppercase tracking-tighter">
              {gameState.currentBatterIndex + 1 < gameState.players.length
                ? 'NEXT PLAYER'
                : gameState.currentInning < gameState.totalInnings
                  ? gameState.players.length === 1 ? 'NEXT INNING' : 'NEXT PLAYER'
                  : 'VIEW RESULTS'}
            </span>
            <ArrowRight size={24} className="text-on-primary" />
          </button>
          <button
            onClick={onEndGame}
            className="h-14 w-full bg-surface-container-highest/60 backdrop-blur-md rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container-highest transition-colors active:scale-95"
          >
            <span className="font-body font-bold text-on-surface-variant text-sm uppercase tracking-widest">End Game</span>
          </button>
        </div>
      </div>
    </motion.main>
  );
}
