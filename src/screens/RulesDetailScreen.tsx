import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { Screen } from '../types';

interface RulesDetailScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function RulesDetailScreen({ onNavigate }: RulesDetailScreenProps) {
  return (
    <motion.main
      key="rules-detail"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 50, opacity: 0 }}
      className="pt-24 pb-32 px-6 max-w-3xl mx-auto"
    >
      <section className="mb-12">
        <span className="text-secondary font-bold tracking-widest text-xs uppercase mb-2 block">Detailed Guide</span>
        <h2 className="text-5xl md:text-7xl font-headline font-black text-on-background uppercase leading-[0.9] tracking-tighter mb-8">
          HOW TO <br />
          <span className="text-primary">PLAY</span>
        </h2>

        <div className="space-y-8 text-on-surface-variant text-lg leading-relaxed">
          <p>
            Players take turns at 'bat', and they score runs based on oncoming traffic. For vehicles to count, they must be moving and traveling in the opposite direction.
          </p>

          <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/10">
            <h3 className="text-primary font-headline font-black text-2xl uppercase mb-6 tracking-tighter italic">Scoring</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                <span><strong className="text-on-surface">White, Silver, or Grey cars</strong> = 1 Run</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                <span><strong className="text-on-surface">Coloured cars (excluding Red)</strong> = 2 Runs</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                <span><strong className="text-on-surface">Motorbikes</strong> = 4 Runs</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                <span><strong className="text-on-surface">Trucks or Buses</strong> = 6 Runs</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                <span><strong className="text-on-surface">Any vehicle towing anything</strong> = +1 "overthrow" run (e.g. white car towing a trailer will give you 2 runs)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2.5 shrink-0" />
                <span><strong className="text-secondary">Any Red car</strong> = YOU'RE OUT</span>
              </li>
            </ul>
          </div>

          <p>
            Once everyone has had a turn at bat, the player with the highest score wins.
          </p>

          <div className="p-6 bg-surface-container-high rounded-xl border-l-4 border-secondary/50">
            <p className="text-sm font-bold text-on-surface uppercase tracking-widest mb-2">Pro Tip</p>
            <p className="italic">
              Note: This game works well on open roads for long road trips, not so well with city driving.
            </p>
          </div>

          <div className="p-6 bg-primary/10 rounded-xl border border-primary/20">
            <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Optional Extra</p>
            <p>
              <strong className="text-on-surface">Emergency Vehicles:</strong> An ambulance or fire truck with lights on could be a "Free Hit" (doubles the next vehicle).
            </p>
          </div>
        </div>
      </section>

      <div className="flex justify-center mt-12">
        <button
          onClick={() => onNavigate('rules')}
          className="bg-surface-container-highest text-on-surface font-headline font-black px-12 py-5 rounded-full text-xl flex items-center gap-3 active:scale-95 transition-all border border-outline-variant/30"
        >
          <ChevronLeft size={24} />
          BACK TO RULES
        </button>
      </div>
    </motion.main>
  );
}
