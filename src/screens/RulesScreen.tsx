import { motion } from 'motion/react';
import { Info, Skull, ChevronLeft } from 'lucide-react';
import { IconMap } from '../components/Common';
import { SCORING_RULES, Screen } from '../types';

interface RulesScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function RulesScreen({ onNavigate }: RulesScreenProps) {
  return (
    <motion.main
      key="rules"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className="pt-24 pb-32 px-6 max-w-4xl mx-auto"
    >
      <section className="mb-12">
        <span className="text-secondary font-bold tracking-widest text-xs uppercase mb-2 block">Official Handbook</span>
        <h2 className="text-5xl md:text-7xl font-headline font-black text-on-background uppercase leading-[0.9] tracking-tighter mb-4">
          THE RULES <br />
          <span className="text-primary">OF THE ROAD</span>
        </h2>
        <p className="text-on-surface-variant max-w-md text-lg leading-relaxed">
          Turn your next road trip into a high-stakes stadium event. Watch the passing lane, score big, and avoid the red car at all costs.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <div className="bg-surface-container-low rounded-lg p-6 border-t-4 border-primary">
          <h3 className="text-primary font-headline font-extrabold text-2xl mb-6 flex items-center gap-2">
            <Info size={24} /> SCORING SYSTEM
          </h3>
          <div className="space-y-4">
            {SCORING_RULES.filter(r => !r.isOut).map(rule => {
              const Icon = IconMap[rule.icon as keyof typeof IconMap];
              return (
                <div key={rule.id} className="flex items-center justify-between p-4 bg-surface-container-high rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon size={24} className={rule.color} />
                    <div>
                      <p className="font-bold">{rule.label}</p>
                      <p className="text-xs text-on-surface-variant">{rule.sublabel}</p>
                    </div>
                  </div>
                  <div className="text-2xl font-headline font-black text-primary">{rule.runs} RUN{rule.runs > 1 ? 'S' : ''}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-error-container/20 border border-error-container/40 rounded-lg p-6 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
              <Skull size={24} className="text-on-secondary" />
            </div>
            <h4 className="text-secondary font-headline font-black text-2xl uppercase italic tracking-tighter">RED CAR = OUT</h4>
          </div>
          <p className="text-on-surface font-medium">
            Spotting a red car ends the batsman's innings immediately. Hand over the scoring duties to the next player.
          </p>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={() => onNavigate('rules-detail')}
          className="text-on-surface-variant text-lg leading-relaxed underline hover:text-primary transition-colors"
        >
          More information
        </button>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => onNavigate('home')}
          className="bg-primary text-on-primary font-headline font-black px-12 py-5 rounded-full text-xl flex items-center gap-3 active:scale-95 transition-all shadow-lg"
        >
          <ChevronLeft size={24} />
          RETURN TO PITCH
        </button>
      </div>
    </motion.main>
  );
}
