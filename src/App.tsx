import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Info, Maximize2, Minimize2, X } from 'lucide-react';
import { Screen, GameState, SCORING_RULES } from './types';
import { Avatar, BottomNav } from './components/Common';

const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const SetupSquadScreen = lazy(() => import('./screens/SetupSquadScreen'));
const SetupInningsScreen = lazy(() => import('./screens/SetupInningsScreen'));
const NextBatterScreen = lazy(() => import('./screens/NextBatterScreen'));
const GameScreen = lazy(() => import('./screens/GameScreen'));
const OutScreen = lazy(() => import('./screens/OutScreen'));
const LeaderboardScreen = lazy(() => import('./screens/LeaderboardScreen'));
const RulesScreen = lazy(() => import('./screens/RulesScreen'));
const RulesDetailScreen = lazy(() => import('./screens/RulesDetailScreen'));

const STORAGE_KEY = 'tarmac20_state';

function loadSavedState(): { screen: Screen; gameState: GameState } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const defaultGameState: GameState = {
  players: [{ id: '1', name: 'ENTER NAME', runs: 0, totalRuns: 0, ballsFaced: 0, totalBallsFaced: 0, isOut: false }],
  currentBatterIndex: 0,
  totalInnings: 2,
  currentInning: 1,
  history: []
};

export default function App() {
  const saved = loadSavedState();
  const [screen, setScreen] = useState<Screen>(saved?.screen ?? 'home');
  const [gameState, setGameState] = useState<GameState>(saved?.gameState ?? defaultGameState);

  const [showCustomInnings, setShowCustomInnings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [undoSnapshot, setUndoSnapshot] = useState<{ gameState: GameState; screen: Screen; label: string } | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);
  const abandonTarget = useRef<Screen | null>(null);
  const [showMidGameStats, setShowMidGameStats] = useState(false);
  const [focusMode, setFocusMode] = useState(true);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (screen !== 'game') setFocusMode(true);
  }, [screen]);

  useEffect(() => {
    // Don't persist the home screen — on refresh always start fresh from home
    if (screen === 'home') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ screen, gameState }));
    } catch {}
  }, [screen, gameState]);

  const currentBatter = gameState.players[gameState.currentBatterIndex] ?? gameState.players[0];

  const activeGameScreens: Screen[] = ['game', 'out', 'next-batter'];

  const handleNavigate = (newScreen: Screen) => {
    if (activeGameScreens.includes(screen) && newScreen !== screen) {
      if (newScreen === 'leaderboard') {
        setShowMidGameStats(true);
      } else {
        abandonTarget.current = newScreen;
        setShowAbandonConfirm(true);
      }
    } else {
      setScreen(newScreen);
    }
  };

  const parentScreen: Partial<Record<Screen, Screen>> = {
    'setup-squad':   'home',
    'setup-innings': 'setup-squad',
    'next-batter':   'home',
    'game':          'home',
    'out':           'game',
    'leaderboard':   'home',
    'rules':         'home',
    'rules-detail':  'rules',
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

    const snapshot = { gameState, screen, label: rule.isOut ? 'OUT!' : `+${rule.runs} ${rule.label}` };
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setUndoSnapshot(snapshot);
    undoTimer.current = setTimeout(() => setUndoSnapshot(null), 4000);

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
      setGameState({ ...gameState, currentBatterIndex: nextIndex });
      setScreen('next-batter');
    } else {
      if (gameState.currentInning < gameState.totalInnings) {
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
        setScreen('leaderboard');
      }
    }
  };

  const endGame = () => {
    const finalPlayers = gameState.players.map(p => ({
      ...p,
      totalRuns: p.totalRuns + p.runs,
      totalBallsFaced: p.totalBallsFaced + p.ballsFaced,
    }));
    setGameState({ ...gameState, players: finalPlayers });
    localStorage.removeItem(STORAGE_KEY);
    setScreen('leaderboard');
  };

  // Resets all stats but keeps player names and count, then starts the game
  const startGame = () => {
    const freshPlayers = gameState.players.map(p => ({
      ...p,
      runs: 0,
      totalRuns: 0,
      ballsFaced: 0,
      totalBallsFaced: 0,
      isOut: false,
      dismissalType: undefined,
    }));
    setGameState({
      ...gameState,
      players: freshPlayers,
      currentBatterIndex: 0,
      currentInning: 1,
      history: [],
    });
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setUndoSnapshot(null);
    setScreen('next-batter');
  };

  const clearGameStats = () => {
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
    setShowCustomInnings(false);
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setUndoSnapshot(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const resetGame = () => {
    clearGameStats();
    setScreen('home');
  };

  const handleSelectPreset = (val: number) => {
    setGameState({ ...gameState, totalInnings: val });
    setShowCustomInnings(false);
  };

  const handleEnableCustom = () => {
    setShowCustomInnings(true);
    setGameState({ ...gameState, totalInnings: Math.max(gameState.totalInnings, 4) });
  };

  const handleAdjustCustom = (delta: number) => {
    setGameState({ ...gameState, totalInnings: Math.max(4, gameState.totalInnings + delta) });
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body overflow-x-hidden">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 h-16 bg-background grid grid-cols-[1fr_auto_1fr] items-center px-6">
        <div className="flex items-center gap-3">
          {screen !== 'home' && (
            <button aria-label="Go back" onClick={() => handleNavigate(parentScreen[screen] ?? 'home')} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
              <ChevronLeft size={24} className="text-primary" />
            </button>
          )}
          <div className="w-8 h-8 rounded-full bg-surface-container-high border border-primary/20 overflow-hidden">
            <Avatar name={currentBatter?.name || 'player'} />
          </div>
        </div>
        <h1 className="font-headline tracking-tighter uppercase font-black text-2xl italic text-primary text-center">
          {screen === 'game' ? currentBatter?.name : 'TARMAC20'}
        </h1>
        <div className="flex justify-end">
          {screen === 'game' ? (
            <button
              aria-label={focusMode ? 'Exit focus mode' : 'Enter focus mode'}
              onClick={() => setFocusMode(f => !f)}
              className={`p-2 rounded-full transition-colors ${focusMode ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-high text-on-surface-variant'}`}
            >
              {focusMode ? <Minimize2 size={22} /> : <Maximize2 size={22} />}
            </button>
          ) : (
            <button aria-label="About Tarmac20" onClick={() => setShowInfo(true)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
              <Info size={22} className="text-on-surface-variant" />
            </button>
          )}
        </div>
      </header>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            key="info-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              className="w-full max-w-md bg-surface-container-low rounded-2xl border border-outline-variant/20 shadow-2xl flex flex-col max-h-[85vh]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-8 pt-8 pb-4 shrink-0">
                <h2 className="font-headline font-black text-2xl uppercase tracking-tighter text-primary italic">About</h2>
                <button onClick={() => setShowInfo(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X size={20} className="text-on-surface-variant" />
                </button>
              </div>
              <div className="overflow-y-auto px-8 pb-8 space-y-5 text-on-surface-variant text-sm leading-relaxed">
                <p>
                  <span className="text-on-surface font-bold">Thanks for playing Tarmac20!</span> We hope you're having a great time on the road.
                </p>
                <p>
                  This game started as a childhood car trip pastime — spotting cars and calling out runs. It's been played on long drives for years, and now it's received a modern upgrade to keep the tradition going.
                </p>
                <div className="bg-surface-container-high rounded-xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary mb-1">Feedback & Comments</p>
                  <a
                    href="mailto:info@tarmac20.com"
                    rel="noopener noreferrer"
                    className="text-primary font-bold hover:underline"
                  >
                    info@tarmac20.com
                  </a>
                </div>
                <div className="bg-surface-container-high rounded-xl p-4 overflow-hidden">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary mb-3">Support Us</p>
                  <p className="text-xs mb-3">If you enjoy the game and would like to support its development, a Bitcoin donation is always appreciated.</p>
                  <a
                    href="https://pay.blink.sv/barker"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#F7931A] hover:bg-[#F7931A]/90 active:scale-95 text-white font-bold rounded-xl transition-all text-sm"
                  >
                    ⚡ Donate Bitcoin
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Abandon Game Confirmation */}
      <AnimatePresence>
        {showAbandonConfirm && (
          <motion.div
            key="abandon-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              className="w-full max-w-sm bg-surface-container-low rounded-2xl p-8 border border-outline-variant/20 shadow-2xl text-center"
            >
              <p className="font-headline font-black text-2xl uppercase tracking-tighter text-on-surface mb-2">Abandon Game?</p>
              <p className="text-on-surface-variant text-sm mb-8">Your current game progress will be lost.</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    const target = abandonTarget.current ?? 'home';
                    abandonTarget.current = null;
                    setShowAbandonConfirm(false);
                    clearGameStats();
                    setScreen(target);
                  }}
                  className="h-14 w-full bg-secondary/20 border border-secondary/30 text-secondary rounded-full font-headline font-black text-lg uppercase tracking-tighter active:scale-95 transition-all"
                >
                  Yes, Abandon
                </button>
                <button
                  onClick={() => { setShowAbandonConfirm(false); abandonTarget.current = null; }}
                  className="h-14 w-full bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-full font-headline font-black text-lg uppercase tracking-tighter active:scale-95 transition-all"
                >
                  Keep Playing
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          {screen === 'home'          && <HomeScreen onNavigate={setScreen} />}
          {screen === 'setup-squad'   && <SetupSquadScreen gameState={gameState} onSetPlayerCount={setPlayerCount} onUpdatePlayerName={updatePlayerName} onNavigate={setScreen} />}
          {screen === 'setup-innings' && <SetupInningsScreen gameState={gameState} showCustomInnings={showCustomInnings} onSelectPreset={handleSelectPreset} onEnableCustom={handleEnableCustom} onAdjustCustom={handleAdjustCustom} onStartGame={startGame} />}
          {screen === 'next-batter'   && <NextBatterScreen gameState={gameState} currentBatter={currentBatter} onNavigate={setScreen} />}
          {screen === 'game'          && <GameScreen gameState={gameState} currentBatter={currentBatter} onScore={handleScore} focusMode={focusMode} />}
          {screen === 'out'           && <OutScreen gameState={gameState} currentBatter={currentBatter} onNextPlayer={nextPlayer} onEndGame={endGame} />}
          {screen === 'leaderboard'   && <LeaderboardScreen gameState={gameState} onPlayAgain={resetGame} />}
          {screen === 'rules'         && <RulesScreen onNavigate={setScreen} />}
          {screen === 'rules-detail'  && <RulesDetailScreen onNavigate={setScreen} />}
        </AnimatePresence>
      </Suspense>

      {!(screen === 'game' && focusMode) && <BottomNav active={screen} onNavigate={handleNavigate} />}

      {/* Mid-Game Stats Modal */}
      <AnimatePresence>
        {showMidGameStats && (
          <motion.div
            key="midgame-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-background/95 backdrop-blur-md overflow-y-auto"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-sm border-b border-outline-variant/20">
              <span className="font-headline font-black text-sm uppercase tracking-widest text-on-surface-variant">Mid-Game Standings</span>
              <button
                aria-label="Close standings"
                onClick={() => setShowMidGameStats(false)}
                className="h-10 px-5 bg-primary text-on-primary rounded-full font-headline font-black text-sm uppercase tracking-tighter active:scale-95 transition-all"
              >
                Back to Game
              </button>
            </div>
            <LeaderboardScreen gameState={gameState} onPlayAgain={resetGame} midGame />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Undo Toast */}
      <AnimatePresence>
        {undoSnapshot && (
          <motion.div
            key="undo-toast"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 bg-surface-container-highest border border-outline-variant/30 rounded-full px-5 py-3 shadow-xl"
          >
            <span className="font-body text-sm font-bold text-on-surface">{undoSnapshot.label}</span>
            <button
              onClick={() => {
                if (undoTimer.current) clearTimeout(undoTimer.current);
                setGameState(undoSnapshot.gameState);
                setScreen(undoSnapshot.screen);
                setUndoSnapshot(null);
              }}
              className="font-headline font-black text-xs text-primary uppercase tracking-widest hover:text-primary/80 transition-colors"
            >
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
