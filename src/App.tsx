import { useEffect, useMemo, useState } from 'react';
import { CellMark, Difficulty, Puzzle } from './game/types';
import { getDailyPuzzle, puzzleNumber, dateKey } from './game/daily';
import { puzzleById, puzzlesByDifficulty } from './data/puzzles';
import { levelById, ALL_LEVELS, levelIndex } from './data/levels';
import { eventById } from './data/events';
import { activeEvents } from './data/events';
import { cosmeticById } from './data/cosmetics';
import { loadProgress, saveProgress, completeLevel, claimEventRewards, Progress } from './state/progress';
import { loadStats, recordDailyWin, saveStats, Stats } from './state/stats';
import { loadSettings, saveSettings, prefersReducedMotion, Settings } from './state/settings';
import { loadRaw, save } from './state/storage';
import { useTheme } from './hooks/useTheme';
import { setMuted } from './effects/sound';
import { GameScreen, RevealInfo } from './components/GameScreen';
import { HomeScreen, mascotFor } from './components/HomeScreen';
import { HowToPlay } from './components/HowToPlay';
import { LevelMap } from './components/LevelMap';
import { EventsScreen } from './components/EventsScreen';
import { CustomizeScreen } from './components/CustomizeScreen';
import { StatsScreen } from './components/StatsModal';
import { PracticeScreen } from './components/PracticeScreen';

export type Screen =
  | 'home'
  | 'daily'
  | 'levels'
  | 'events'
  | 'practice'
  | 'customize'
  | 'stats'
  | 'help'
  | 'game';

type Session =
  | { kind: 'daily' }
  | { kind: 'level'; levelId: string }
  | { kind: 'event'; eventId: string; puzzleId: string }
  | { kind: 'practice'; puzzleId: string; difficulty: Difficulty };

interface DailySave {
  marks: CellMark[][];
  solved: boolean;
  timeMs: number;
}

function randomPuzzle(difficulty: Difficulty, excludeId?: string): Puzzle {
  const pool = puzzlesByDifficulty(difficulty).filter((p) => p.id !== excludeId);
  const list = pool.length ? pool : puzzlesByDifficulty(difficulty);
  return list[Math.floor(Math.random() * list.length)];
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [session, setSession] = useState<Session | null>(null);
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [stats, setStats] = useState<Stats>(() => loadStats());
  const [settings, setSettings] = useState<Settings>(() => {
    const s = loadSettings();
    return { ...s, reducedMotion: s.reducedMotion || prefersReducedMotion() };
  });

  useTheme(progress.equipped.theme);

  useEffect(() => saveProgress(progress), [progress]);
  useEffect(() => saveStats(stats), [stats]);
  useEffect(() => {
    saveSettings(settings);
    setMuted(settings.muted);
  }, [settings]);

  const effectColors = useMemo(() => {
    const eff = cosmeticById(progress.equipped.effect);
    return eff?.particleColors ?? ['#7bc47f', '#4f9d54'];
  }, [progress.equipped.effect]);

  const today = dateKey();
  const dailySave = loadRaw<DailySave | null>(`daily:${today}`, null);
  const dailyDone = dailySave?.solved ?? false;
  const mascot = mascotFor(progress.equipped.skin);

  const spendBamboo = (n: number) =>
    setProgress((p) => ({ ...p, bamboo: Math.max(0, p.bamboo - n) }));

  const goHome = () => {
    setSession(null);
    setScreen('home');
  };

  const startDaily = () => {
    setSession({ kind: 'daily' });
    setScreen('game');
  };
  const startLevel = (levelId: string) => {
    setSession({ kind: 'level', levelId });
    setScreen('game');
  };
  const startEvent = (eventId: string, puzzleId: string) => {
    setSession({ kind: 'event', eventId, puzzleId });
    setScreen('game');
  };
  const startPractice = (difficulty: Difficulty) => {
    setSession({ kind: 'practice', puzzleId: randomPuzzle(difficulty).id, difficulty });
    setScreen('game');
  };

  // ---- render a game session ----
  const renderGame = () => {
    if (!session) return null;

    if (session.kind === 'daily') {
      const puzzle = getDailyPuzzle();
      const num = puzzleNumber();
      return (
        <GameScreen
          key={`daily-${today}`}
          puzzle={puzzle}
          mode="daily"
          settings={settings}
          effectColors={effectColors}
          bamboo={progress.bamboo}
          onSpendBamboo={spendBamboo}
          subtitle={`Daily #${num}`}
          initialMarks={dailySave?.marks}
          onPersist={(marks, solved) =>
            save(`daily:${today}`, { marks, solved, timeMs: dailySave?.timeMs ?? 0 } as DailySave)
          }
          onSolved={(timeMs): RevealInfo => {
            save(`daily:${today}`, { marks: [], solved: true, timeMs } as DailySave);
            const next = recordDailyWin(timeMs);
            setStats(next);
            return { streak: next.streak, puzzleNumber: num };
          }}
          onHome={goHome}
        />
      );
    }

    if (session.kind === 'level') {
      const level = levelById(session.levelId);
      const puzzle = level && puzzleById(level.puzzleId);
      if (!level || !puzzle) return null;
      const idx = levelIndex(level.id);
      const next = ALL_LEVELS[idx + 1];
      return (
        <GameScreen
          key={`level-${level.id}`}
          puzzle={puzzle}
          mode="level"
          settings={settings}
          effectColors={effectColors}
          bamboo={progress.bamboo}
          onSpendBamboo={spendBamboo}
          subtitle={`Level ${idx + 1}`}
          onSolved={(timeMs): RevealInfo => {
            const result = completeLevel(progress, level, timeMs);
            setProgress(result.progress);
            return { stars: result.stars, bambooEarned: result.bambooEarned };
          }}
          onHome={goHome}
          onNext={next ? () => startLevel(next.id) : undefined}
          nextLabel="Next level →"
        />
      );
    }

    if (session.kind === 'event') {
      const event = eventById(session.eventId);
      const puzzle = puzzleById(session.puzzleId);
      if (!event || !puzzle) return null;
      return (
        <GameScreen
          key={`event-${event.id}-${puzzle.id}`}
          puzzle={puzzle}
          mode="event"
          settings={settings}
          effectColors={effectColors}
          bamboo={progress.bamboo}
          onSpendBamboo={spendBamboo}
          subtitle={event.name}
          onSolved={(): RevealInfo => {
            const already = progress.claimedEvents.includes(event.id);
            setProgress((p) => {
              const withReward = claimEventRewards(p, event.id, event.rewardCosmetics);
              return { ...withReward, bamboo: withReward.bamboo + 15 };
            });
            return { bambooEarned: already ? 15 : 15 };
          }}
          onHome={goHome}
        />
      );
    }

    // practice
    const puzzle = puzzleById(session.puzzleId);
    if (!puzzle) return null;
    return (
      <GameScreen
        key={`practice-${puzzle.id}-${Math.random()}`}
        puzzle={puzzle}
        mode="practice"
        settings={settings}
        effectColors={effectColors}
        bamboo={progress.bamboo}
        onSpendBamboo={spendBamboo}
        subtitle="Practice"
        onSolved={(): RevealInfo => {
          setProgress((p) => ({ ...p, bamboo: p.bamboo + 5 }));
          return { bambooEarned: 5 };
        }}
        onHome={goHome}
        onNext={() =>
          setSession({
            kind: 'practice',
            puzzleId: randomPuzzle(session.difficulty, puzzle.id).id,
            difficulty: session.difficulty,
          })
        }
        nextLabel="New puzzle"
      />
    );
  };

  return (
    <div className="app">
      {screen === 'home' && (
        <HomeScreen
          onNavigate={(s) => (s === 'daily' ? startDaily() : setScreen(s))}
          bamboo={progress.bamboo}
          streak={stats.streak}
          mascot={mascot}
          dailyDone={dailyDone}
          activeEventCount={activeEvents().length}
        />
      )}
      {screen === 'game' && renderGame()}
      {screen === 'levels' && (
        <LevelMap progress={progress} onPlayLevel={startLevel} onHome={goHome} />
      )}
      {screen === 'events' && (
        <EventsScreen progress={progress} onPlayEventPuzzle={startEvent} onHome={goHome} />
      )}
      {screen === 'practice' && <PracticeScreen onPick={startPractice} onHome={goHome} />}
      {screen === 'customize' && (
        <CustomizeScreen
          progress={progress}
          settings={settings}
          onProgress={setProgress}
          onSettings={setSettings}
          onHome={goHome}
        />
      )}
      {screen === 'stats' && <StatsScreen stats={stats} progress={progress} onHome={goHome} />}
      {screen === 'help' && <HowToPlay onClose={goHome} />}
    </div>
  );
}
