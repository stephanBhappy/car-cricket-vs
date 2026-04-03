import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  BookOpen,
  ChevronLeft,
  ArrowRight,
  Plus,
  Minus,
  Star,
  Zap,
  Info,
  Users,
  Skull,
} from 'lucide-react';
import { Screen, Player, GameState, SCORING_RULES } from './types';
import { Ticker, BottomNav, IconMap } from './components/Common';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [gameState, setGameState] = useState<GameState>({
    players: [{ id: '1', name: 'PLAYER 1', runs: 0, totalRuns: 0, ballsFaced: 0, totalBallsFaced: 0, isOut: false }],
    currentBatterIndex: 0,
    totalInnings: 2,
    currentInning: 1,
    history: []
  });

  const [showCustomInnings, setShowCustomInnings] = useState(false);

  const currentBatter = gameState.players[gameState.currentBatterIndex] ?? gameState.players[0];

  const handleNavigate = (newScreen: Screen) => {
    setScreen(newScreen);
  };

  const updatePlayerName = (index: number, name: string) => {
    const newPlayers = [...gameState.players];
    newPlayers[index] = { ...newPlayers[index], name };
    setGameState({ ...gameState, players: newPlayers });
  };

  const setPlayerCount = (count: number) => {
    const newPlayers = Array.from({ length: count }, (_, i) => ({
      id: String(i + 1),
      name: gameState.players[i]?.name || `PLAYER ${i + 1}`,
      runs: 0,
      totalRuns: 0,
      ballsFaced: 0,
      totalBallsFaced: 0,
      isOut: false
    }));
    setGameState({ ...gameState, players: newPlayers });
  };

  const handleScore = (ruleId: string) => {
    const rule = SCORING_RULES.find(r => r.id === ruleId);
    if (!rule) return;

    const newPlayers = [...gameState.players];
    const batter = { ...newPlayers[gameState.currentBatterIndex] };

    if (rule.isOut) {
      batter.isOut = true;
      batter.ballsFaced += 1;
      batter.dismissalType = 'Caught (Red Car)';
      newPlayers[gameState.currentBatterIndex] = batter;
      setGameState({ ...gameState, players: newPlayers });
      setScreen('out');
    } else {
      batter.runs += rule.runs;
      if (!rule.noBall) batter.ballsFaced += 1;
      newPlayers[gameState.currentBatterIndex] = batter;
      setGameState({ 
        ...gameState, 
        players: newPlayers,
        history: [rule.runs, ...gameState.history].slice(0, 5)
      });
    }
  };

  const nextPlayer = () => {
    const nextIndex = gameState.currentBatterIndex + 1;
    
    if (nextIndex < gameState.players.length) {
      // Move to next player in current inning
      setGameState({ ...gameState, currentBatterIndex: nextIndex });
      setScreen('next-batter');
    } else {
      // End of current inning
      if (gameState.currentInning < gameState.totalInnings) {
        // Start next inning, accumulate runs then reset per-inning stats
        const resetPlayers = gameState.players.map(p => ({
          ...p,
          totalRuns: p.totalRuns + p.runs,
          totalBallsFaced: p.totalBallsFaced + p.ballsFaced,
          runs: 0,
          ballsFaced: 0,
          isOut: false,
          dismissalType: undefined
        }));
        setGameState({
          ...gameState,
          players: resetPlayers,
          currentBatterIndex: 0,
          currentInning: gameState.currentInning + 1,
          history: []
        });
        setScreen('next-batter');
      } else {
        // End of game
        setScreen('leaderboard');
      }
    }
  };

  const resetGame = () => {
    const resetPlayers = gameState.players.map(p => ({
      ...p,
      runs: 0,
      totalRuns: 0,
      ballsFaced: 0,
      totalBallsFaced: 0,
      isOut: false,
      dismissalType: undefined
    }));
    setGameState({
      ...gameState,
      players: resetPlayers,
      currentBatterIndex: 0,
      currentInning: 1,
      history: []
    });
    setScreen('home');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body overflow-x-hidden">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 h-16 bg-background flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          {screen !== 'home' && (
            <button onClick={() => setScreen('home')} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
              <ChevronLeft size={24} className="text-primary" />
            </button>
          )}
          <div className="w-8 h-8 rounded-full bg-surface-container-high border border-primary/20 overflow-hidden">
            <img 
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${currentBatter?.name || 'player'}`} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <h1 className="font-headline tracking-tighter uppercase font-black text-2xl italic text-primary truncate max-w-[180px] sm:max-w-[300px]">
          {screen === 'game' ? currentBatter?.name : 'TARMAC TWENTY20'}
        </h1>
        <div className="w-10" />
      </header>

      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <motion.main 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen flex flex-col items-center justify-center px-6 pb-32 pt-20"
          >
            <div className="fixed inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1920" 
                alt="Background" 
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
            </div>

            <div className="relative z-10 w-full max-w-md flex flex-col items-center">
              <div className="w-full bg-surface-container-lowest/40 backdrop-blur-md rounded-full py-2 px-6 mb-12 border border-outline-variant/10">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Road Trip Cricket • Spot Cars, Score Runs
                  </span>
                </div>
              </div>

              <div className="text-center mb-16">
                <h2 className="font-headline text-[3.5rem] md:text-[5rem] font-black leading-[0.85] tracking-tighter italic text-primary uppercase text-glow mb-2">
                  TARMAC<br/>TWENTY20
                </h2>
                <p className="font-body text-secondary font-extrabold tracking-[0.4em] text-sm uppercase">
                  The Asphalt League
                </p>
              </div>

              <div className="w-full max-w-sm flex flex-col gap-4">
                <button 
                  onClick={() => setScreen('setup-squad')}
                  className="h-20 w-full rounded-full bg-gradient-to-r from-primary to-primary-container flex items-center justify-center active:scale-95 transition-all shadow-[0_12px_40px_-12px_rgba(205,255,96,0.3)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-headline font-black text-2xl text-on-primary tracking-tighter">START GAME</span>
                    <Play size={24} fill="currentColor" className="text-on-primary" />
                  </div>
                </button>
                <button 
                  onClick={() => setScreen('rules')}
                  className="h-16 w-full rounded-full bg-surface-container-highest border border-secondary/20 flex items-center justify-center active:scale-95 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-headline font-bold text-lg text-secondary tracking-tight uppercase">RULES & HANDBOOK</span>
                    <BookOpen size={20} className="text-secondary" />
                  </div>
                </button>
              </div>
            </div>
          </motion.main>
        )}

        {screen === 'setup-squad' && (
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
                    onClick={() => setPlayerCount(count)}
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
                <motion.div 
                  layout
                  key={player.id} 
                  className="relative group"
                >
                  <div className="relative bg-surface-container-low p-5 rounded-2xl flex items-center gap-4 border border-outline-variant/10 hover:border-primary/30 transition-colors shadow-sm">
                    <div className="w-12 h-12 bg-surface-container-highest rounded-xl flex items-center justify-center shadow-inner">
                      <span className={`font-headline font-black text-xl ${i % 2 === 0 ? 'text-primary' : 'text-secondary'}`}>P{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <label className={`block text-[10px] font-bold uppercase tracking-[0.1em] mb-1 ${i % 2 === 0 ? 'text-tertiary' : 'text-secondary'} opacity-80`}>
                        {['Opener', 'No. 2', 'No. 3', 'Middle Order', 'Lower Order', 'Last Man'][i] ?? 'Substitute'}
                      </label>
                      <input 
                        className="w-full bg-transparent border-none p-0 text-lg font-headline font-bold text-on-surface focus:ring-0 placeholder:text-on-surface-variant/30"
                        value={player.name}
                        onChange={(e) => updatePlayerName(i, e.target.value)}
                        placeholder="Enter name..."
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </section>

            <div className="mt-10 w-full max-w-md mx-auto">
              <button 
                onClick={() => setScreen('setup-innings')}
                className="w-full h-16 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-black text-xl italic tracking-tighter shadow-[0_12px_48px_rgba(205,255,96,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 uppercase"
              >
                Next Step
                <ArrowRight size={24} />
              </button>
            </div>
          </motion.main>
        )}

        {screen === 'setup-innings' && (
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
                CHOOSE YOUR<br/><span className="text-primary italic">INNINGS</span>
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
                  onClick={() => { setGameState({ ...gameState, totalInnings: opt.val }); setShowCustomInnings(false); }}
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
                onClick={() => { setShowCustomInnings(true); setGameState({ ...gameState, totalInnings: Math.max(gameState.totalInnings, 4) }); }}
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
                        onClick={() => setGameState({ ...gameState, totalInnings: Math.max(4, gameState.totalInnings - 1) })}
                        className="w-10 h-10 rounded-md bg-surface-container-highest flex items-center justify-center text-on-surface active:scale-90"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="font-headline text-3xl font-black w-8 text-center">{gameState.totalInnings}</span>
                      <button
                        onClick={() => setGameState({ ...gameState, totalInnings: gameState.totalInnings + 1 })}
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
                onClick={() => setScreen('next-batter')}
                className="w-full h-16 rounded-full bg-gradient-to-r from-primary to-primary-container flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_12px_40px_rgba(205,255,96,0.15)] group"
              >
                <span className="font-headline text-lg font-black text-on-primary uppercase tracking-tight">START GAME</span>
                <Play size={20} fill="currentColor" className="text-on-primary" />
              </button>
            </div>
          </motion.main>
        )}

        {screen === 'next-batter' && (
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
                  onClick={() => setScreen('game')}
                  className="group relative w-full bg-gradient-to-b from-primary to-primary-container h-16 rounded-full flex items-center justify-center gap-3 active:scale-95 transition-all duration-300 shadow-[0_8px_32px_rgba(205,255,96,0.2)]"
                >
                  <span className="font-headline text-on-primary text-xl font-black uppercase tracking-tighter">START BAT</span>
                  <Play size={24} fill="currentColor" className="text-on-primary" />
                </button>
                <p className="font-body text-xs text-on-surface-variant/60 uppercase font-bold tracking-widest">
                  {gameState.currentBatterIndex === 0 && gameState.currentInning === 1
                    ? 'Get ready for the first delivery'
                    : 'You\'re up next'}
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
        )}

        {screen === 'game' && (
          <motion.main 
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-20 pb-32 px-6 min-h-screen"
          >
            <section className="mb-8">
              <div className="bg-surface-container-low rounded-lg p-6 flex flex-col items-center justify-center relative overflow-hidden">
                <span className="font-body text-tertiary font-bold tracking-[0.2em] mb-1">INNING {gameState.currentInning} / {gameState.totalInnings}</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline text-[5rem] font-black leading-none text-primary tracking-tighter">{currentBatter.runs}</span>
                  <span className="font-headline text-2xl font-bold text-tertiary">RUNS</span>
                </div>
                <div className="flex gap-8 mt-4">
                  <div className="flex flex-col items-center">
                    <span className="font-body text-[10px] text-on-surface-variant font-bold">STRIKE RATE</span>
                    <span className="font-headline text-xl font-bold">{(currentBatter.runs / (currentBatter.ballsFaced || 1) * 100).toFixed(1)}</span>
                  </div>
                  <div className="w-[1px] bg-outline-variant/30"></div>
                  <div className="flex flex-col items-center">
                    <span className="font-body text-[10px] text-on-surface-variant font-bold">LAST BALL</span>
                    <span className="font-headline text-xl font-bold text-secondary">{gameState.history[0] || '-'}</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-4">
              {SCORING_RULES.map(rule => {
                const Icon = IconMap[rule.icon as keyof typeof IconMap];
                return (
                  <button 
                    key={rule.id}
                    onClick={() => handleScore(rule.id)}
                    className={`${rule.id === 'truck' ? 'bg-primary' : rule.id === 'out' ? 'bg-secondary/10 border-2 border-secondary/30' : 'bg-surface-container-high'} rounded-lg p-6 h-48 flex flex-col justify-between items-center text-center active:scale-95 transition-all duration-200 group`}
                  >
                    <div className="flex flex-col items-center">
                      <Icon size={40} className={`${rule.id === 'truck' ? 'text-on-primary' : rule.color} mb-2`} />
                      <span className={`font-body text-[10px] font-bold tracking-wider uppercase ${rule.id === 'truck' ? 'text-on-primary-container' : rule.color}`}>{rule.label}</span>
                    </div>
                    <div className="w-full">
                      <span className={`block font-headline text-4xl font-black ${rule.id === 'truck' ? 'text-on-primary' : rule.id === 'out' ? 'text-secondary' : 'text-on-background'}`}>
                        {rule.isOut ? 'OUT!' : `+${rule.runs}`}
                      </span>
                      <span className={`font-body text-[12px] font-bold ${rule.id === 'truck' ? 'text-on-primary-container' : 'text-tertiary'}`}>{rule.sublabel}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.main>
        )}

        {screen === 'out' && (
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
                      <p className="text-on-surface-variant font-body text-[10px] uppercase">Runs Scored</p>
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
                  onClick={nextPlayer}
                  className="h-16 w-full bg-gradient-to-r from-primary to-primary-container rounded-full flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg"
                >
                  <span className="font-headline font-black text-on-primary text-xl uppercase tracking-tighter">
                    {(gameState.currentBatterIndex + 1 < gameState.players.length || gameState.currentInning < gameState.totalInnings) ? 'NEXT PLAYER' : 'VIEW RESULTS'}
                  </span>
                  <ArrowRight size={24} className="text-on-primary" />
                </button>
                <button 
                  onClick={() => setScreen('leaderboard')}
                  className="h-14 w-full bg-surface-container-highest/60 backdrop-blur-md rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container-highest transition-colors active:scale-95"
                >
                  <span className="font-body font-bold text-on-surface-variant text-sm uppercase tracking-widest">End Innings</span>
                </button>
              </div>
            </div>
          </motion.main>
        )}

        {screen === 'leaderboard' && (
          <motion.main 
            key="leaderboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-24 px-6 max-w-2xl mx-auto pb-32"
          >
            {(() => {
              const ranked = [...gameState.players].sort((a, b) => (b.totalRuns + b.runs) - (a.totalRuns + a.runs));
              const champion = ranked[0];
              return (<>
            <div className="relative mb-12 text-center">
              <div className="text-secondary font-headline font-black italic uppercase tracking-widest text-sm mb-4">Champions Arena</div>
              <div className="relative mb-6 inline-block">
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-primary via-primary-container to-secondary">
                  <div className="w-full h-full rounded-full overflow-hidden bg-background">
                    <img
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${champion.name}`}
                      alt="Champion"
                      className="w-full h-full object-cover"
                    />
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
                        <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${player.name}`} alt={player.name} className="w-full h-full" />
                      </div>
                      <div>
                        <div className="font-headline font-bold text-lg leading-none mb-1 text-on-surface">{player.name}</div>
                        <div className="text-[10px] font-body font-bold text-on-surface-variant uppercase tracking-widest">
                          {i === 0 ? 'Master Blaster' : i === 1 ? 'Steady Anchor' : 'Power Hitter'}
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

            <div className="mt-12">
              <button 
                onClick={resetGame}
                className="w-full h-16 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-full font-headline font-black text-xl tracking-tighter uppercase italic flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
              >
                <Play size={24} fill="currentColor" />
                PLAY AGAIN
              </button>
            </div>
            </>);
            })()}
          </motion.main>
        )}

        {screen === 'rules' && (
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
                THE RULES <br/>
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
                onClick={() => setScreen('rules-detail')}
                className="text-on-surface-variant text-lg leading-relaxed underline hover:text-primary transition-colors"
              >
                More information
              </button>
            </div>

            <div className="flex justify-center mt-4">
              <button 
                onClick={() => setScreen('home')}
                className="bg-primary text-on-primary font-headline font-black px-12 py-5 rounded-full text-xl flex items-center gap-3 active:scale-95 transition-all shadow-lg"
              >
                <ChevronLeft size={24} />
                RETURN TO PITCH
              </button>
            </div>
          </motion.main>
        )}

        {screen === 'rules-detail' && (
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
                HOW TO <br/>
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
                onClick={() => setScreen('rules')}
                className="bg-surface-container-highest text-on-surface font-headline font-black px-12 py-5 rounded-full text-xl flex items-center gap-3 active:scale-95 transition-all border border-outline-variant/30"
              >
                <ChevronLeft size={24} />
                BACK TO RULES
              </button>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      <BottomNav active={screen} onNavigate={handleNavigate} />
    </div>
  );
}
