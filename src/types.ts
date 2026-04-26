export type Screen = 'home' | 'setup-squad' | 'setup-innings' | 'next-batter' | 'game' | 'out' | 'leaderboard' | 'rules';

export interface Player {
  id: string;
  name: string;
  runs: number;
  totalRuns: number;
  ballsFaced: number;
  totalBallsFaced: number;
  isOut: boolean;
  dismissalType?: string;
}

export interface GameState {
  players: Player[];
  currentBatterIndex: number;
  totalInnings: number;
  currentInning: number;
  history: number[];
}

export const SCORING_RULES = [
  { id: 'neutral', label: 'Neutral Car', sublabel: 'White, Silver, or Grey cars', runs: 1, icon: 'Car', color: 'text-on-surface-variant' },
  { id: 'color', label: 'Colour Car', sublabel: 'Any Colour, Excl. Red', runs: 2, icon: 'CarFront', color: 'text-primary' },
  { id: 'bike', label: 'Bike / Scooter', sublabel: 'Boundary', runs: 4, icon: 'Bike', color: 'text-tertiary' },
  { id: 'truck', label: 'Truck / Bus', sublabel: 'Maximum', runs: 6, icon: 'Bus', color: 'text-primary' },
  { id: 'towing', label: 'Towing / Trailer', sublabel: 'Bonus Run', description: '+1 run added to the vehicle\'s score (e.g. white car towing = 2 runs)', runs: 1, icon: 'Caravan', color: 'text-secondary', noBall: true },
  { id: 'out', label: 'Red Car', sublabel: 'Next Batter', runs: 0, icon: 'Skull', color: 'text-secondary', isOut: true },
];
