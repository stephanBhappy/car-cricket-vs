import { motion } from 'motion/react';
import { Star, Zap, Play } from 'lucide-react';
import { Avatar } from '../components/Common';
import { GameState } from '../types';

interface LeaderboardScreenProps {
  gameState: GameState;
  onPlayAgain: () => void;
  midGame?: boolean;
}

export default function LeaderboardScreen({ gameState, onPlayAgain, midGame }: LeaderboardScreenProps) {
  const ranked = [...gameState.players].sort((a, b) => (b.totalRuns + b.runs) - (a.totalRuns + a.runs));
  const champion = ranked[0];

  return (
    <motion.main
      key="leaderboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 px-6 max-w-2xl mx-auto pb-32"
    >
      <div className="relative mb-12 text-center">
        <div className="text-secondary font-headline font-black italic uppercase tracking-widest text-sm mb-4">Champions Arena</div>
        <div className="relative mb-6 inline-block">
          <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-primary via-primary-container to-secondary">
            <div className="w-full h-full rounded-full overflow-hidden bg-background">
              <Avatar name={champion.name} />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-secondary text-on-secondary w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-4 border-background">
            <Star size={20} fill="currentColor" />
          </div>
        </div>
        <h2 className="font-headline font-black text-white text-5xl tracking-tighter uppercase mb-1">
          {champion.name}
        </h2>
        <div className="inline-flex items-center gap-2 bg-surface-container-highest px-4 py-1.5 rounded-full mb-8">
          <Zap size={16} className="text-primary" />
          <span className="font-headline font-bold text-primary tracking-tight">
            {champion.totalRuns + champion.runs} RUNS
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {ranked.map((player, i) => (
          <div key={player.id} className={`flex items-center justify-between p-5 rounded-lg ${i === 0 ? 'bg-surface-container-highest border-2 border-primary/20' : 'bg-surface-container-high'}`}>
            <div className="flex items-center gap-4">
              <span className={`font-headline font-black text-2xl ${i === 0 ? 'text-primary' : 'text-on-surface-variant'}`}>{String(i + 1).padStart(2, '0')}</span>
              <div className="w-12 h-12 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/20">
                <Avatar name={player.name} />
              </div>
              <div>
                <div className="font-headline font-bold text-lg leading-none mb-1 text-on-surface">{player.name}</div>
                <div className="text-[10px] font-body font-bold text-on-surface-variant uppercase tracking-widest">
                  {['Master Blaster', 'Steady Anchor', 'Power Hitter', 'All-Rounder', 'Tail-Ender', 'Last Man'][i] ?? 'Power Hitter'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-headline font-black text-xl text-on-surface">{player.totalRuns + player.runs}</div>
              <div className="text-[10px] font-body font-bold text-secondary uppercase tracking-tighter">
                {((player.totalRuns + player.runs) / (player.totalBallsFaced + player.ballsFaced || 1)).toFixed(1)} RPB
              </div>
            </div>
          </div>
        ))}
      </div>

      {!midGame && (
        <div className="mt-12">
          <button
            onClick={onPlayAgain}
            className="w-full h-16 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-full font-headline font-black text-xl tracking-tighter uppercase italic flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
          >
            <Play size={24} fill="currentColor" />
            PLAY AGAIN
          </button>
        </div>
      )}
    </motion.main>
  );
}
