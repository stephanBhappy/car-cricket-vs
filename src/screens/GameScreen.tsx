import { motion } from 'motion/react';
import { IconMap } from '../components/IconMap';
import { GameState, Player, SCORING_RULES } from '../types';

interface GameScreenProps {
  gameState: GameState;
  currentBatter: Player;
  onScore: (ruleId: string) => void;
  focusMode: boolean;
}

export default function GameScreen({ gameState, currentBatter, onScore, focusMode }: GameScreenProps) {
  return (
    <motion.main
      key="game"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`px-6 min-h-screen ${focusMode ? 'pt-20 pb-4' : 'pt-20 pb-32'}`}
    >
      <section className={focusMode ? 'mb-3' : 'mb-8'}>
        <div className={`bg-surface-container-low rounded-lg flex flex-col items-center justify-center relative overflow-hidden ${focusMode ? 'py-3 px-4' : 'p-6'}`}>
          <span className="font-body text-tertiary font-bold tracking-[0.2em] mb-1">INNING {gameState.currentInning} / {gameState.totalInnings}</span>
          <div className="flex items-baseline gap-2">
            <span className={`font-headline font-black leading-none text-primary tracking-tighter ${focusMode ? 'text-[3.5rem]' : 'text-[5rem]'}`}>{currentBatter.runs}</span>
            <span className={`font-headline font-bold text-tertiary ${focusMode ? 'text-xl' : 'text-2xl'}`}>RUNS</span>
          </div>
          {!focusMode && (
            <div className="flex gap-8 mt-4">
              <div className="flex flex-col items-center">
                <span className="font-body text-[10px] text-on-surface-variant font-bold">STRIKE RATE</span>
                <span className="font-headline text-xl font-bold">{currentBatter.ballsFaced === 0 ? '—' : (currentBatter.runs / currentBatter.ballsFaced * 100).toFixed(1)}</span>
              </div>
              <div className="w-[1px] bg-outline-variant/30"></div>
              <div className="flex flex-col items-center">
                <span className="font-body text-[10px] text-on-surface-variant font-bold">LAST BALL</span>
                <span className="font-headline text-xl font-bold text-secondary">{gameState.history[0] || '-'}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className={`grid grid-cols-2 ${focusMode ? 'gap-2' : 'gap-4'}`}>
        {SCORING_RULES.map(rule => {
          const Icon = IconMap[rule.icon as keyof typeof IconMap];
          return (
            <button
              key={rule.id}
              onClick={() => onScore(rule.id)}
              className={`${rule.id === 'truck' ? 'bg-primary' : rule.id === 'out' ? 'bg-secondary/10 border-2 border-secondary/30' : 'bg-surface-container-high'} rounded-lg px-4 py-4 h-40 flex flex-col items-center justify-between text-center active:scale-95 transition-all duration-200 group`}
            >
              <div className="flex flex-col items-center justify-center">
                <Icon size={36} className={`${rule.id === 'truck' ? 'text-on-primary' : rule.color} mb-1`} />
                <span className={`font-body text-[10px] font-bold tracking-wider uppercase ${rule.id === 'truck' ? 'text-on-primary-container' : rule.color}`}>{rule.label}</span>
              </div>
              <div className="flex items-center justify-center">
                <span className={`font-headline text-4xl font-black ${rule.id === 'truck' ? 'text-on-primary' : rule.id === 'out' ? 'text-secondary' : 'text-on-background'}`}>
                  {rule.isOut ? 'OUT!' : `+${rule.runs}`}
                </span>
              </div>
              <div className="flex items-center justify-center">
                <span className={`font-body text-[12px] font-bold ${rule.id === 'truck' ? 'text-on-primary-container' : 'text-tertiary'}`}>{rule.sublabel}</span>
              </div>
            </button>
          );
        })}
      </div>
    </motion.main>
  );
}
