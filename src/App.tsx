import { useEffect, useMemo, useState } from 'react';
import { CellMark, Difficulty, Puzzle } from './game/types';
import { getDailyPuzzle, puzzleNumber, dateKey } from './game/daily';
import { puzzleById, puzzlesByDifficulty } from './data/puzzles';
import { levelById, ALL_LEVELS, CHAPTERS, levelIndex, chapterOfLevel } from './data/levels';
import { eventById } from './data/events';
import { activeEvents } from './data/events';
import { tokenFor, particleStyle, cosmeticById } from './data/cosmetics';
import {
  loadProgress, saveProgress, completeLevel, markSolved, Progress,
  claimChapterBonuses, claimMilestones, CHAPTER_CLEAR_BONUS,
} from './state/progress';
import { loadStats, recordDailyWin, saveStats, dailyReward, Stats } from './state/stats';
import { loadSettings, saveSettings, prefersReducedMotion, Settings } from './state/settings';
import { loadRaw, save } from './state/storage';
import { useTheme } from './hooks/useTheme';
import { setMuted } from './effects/sound';
import { setMusicEnabled, primeMusic } from './effects/music';
import { GameScreen, RevealInfo } from './components/GameScreen';
import { HomeScreen, mascotFor } from './components/HomeScreen';
import { HowToPlay } from './components/HowToPlay';
import { LevelMap } from './components/LevelMap';
import { EventsScreen } from './components/EventsScreen';
import { CustomizeScreen } from './components/CustomizeScreen';
import { StatsScreen } from './components/StatsModal';
import { PracticeScreen } from './components/PracticeScreen';
import { Scenery } from './components/Scenery';
import { GachaScreen } from './components/GachaScreen';
import { GACHA_COST, GachaResult, pullCapsule } from './game/gacha';
import { ArcadeScreen, ArcadeGame } from './components/ArcadeScreen';
import { PairsGame } from './components/PairsGame';
import { LightningGame } from './components/LightningGame';

export type Screen =
  | 'home'
  | 'daily'
  | 'levels'
  | 'events'
  | 'practice'
  | 'customize'
  | 'stats'
  | 'gacha'
  | 'arcade'
  | 'pairs'
  | 'lightning'
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
    setMusicEnabled(settings.music);
  }, [settings]);

  // Browsers block audio until the first gesture — start music then if enabled.
  useEffect(() => {
    const prime = () => primeMusic();
    window.addEventListener('pointerdown', prime, { once: true });
    return () => window.removeEventListener('pointerdown', prime);
  }, []);

  const effect = useMemo(() => particleStyle(progress.equipped.effect), [progress.equipped.effect]);
  const effectColors = effect.colors;
  const effectShape = effect.shape;
  const fillToken = useMemo(() => tokenFor(progress.equipped.skin), [progress.equipped.skin]);

  const today = dateKey();
  const dailySave = loadRaw<DailySave | null>(`daily:${today}`, null);
  const dailyDone = dailySave?.solved ?? false;
  const mascot = mascotFor(progress.equipped.skin);

  const spendBamboo = (n: number) =>
    setProgress((p) => ({ ...p, bamboo: Math.max(0, p.bamboo - n) }));

  // Grant chapter bonuses + milestones now reached; returns updated progress
  // and reveal-ready goal entries.
  const grantGoals = (p: Progress, s: Stats) => {
    const chapters = claimChapterBonuses(p);
    const miles = claimMilestones(chapters.progress, s);
    const goals = [
      ...chapters.cleared.map((c) => ({
        icon: c.icon,
        name: `${c.name} cleared!`,
        reward: CHAPTER_CLEAR_BONUS,
      })),
      ...miles.earned.map((m) => ({ icon: m.icon, name: m.name, reward: m.reward })),
    ];
    return { progress: miles.progress, goals: goals.length ? goals : undefined };
  };

  // ---- arcade mini games: full bonus once per game per day, small repeats ----
  const arcadeKey = `arcade:${today}`;
  const arcadePlays = loadRaw<Record<ArcadeGame, number>>(arcadeKey, { pairs: 0, lightning: 0 });
  const arcadeReward = (game: ArcadeGame, first: number, repeat: number): number => {
    const plays = loadRaw<Record<ArcadeGame, number>>(arcadeKey, { pairs: 0, lightning: 0 });
    const amount = (plays[game] ?? 0) === 0 ? first : repeat;
    save(arcadeKey, { ...plays, [game]: (plays[game] ?? 0) + 1 });
    return amount;
  };

  // One Lucky Capsule pull; deducts the cost and applies winnings.
  const doPull = (): GachaResult | null => {
    if (progress.bamboo < GACHA_COST) return null;
    const { progress: next, result } = pullCapsule(progress);
    setProgress(next);
    return result;
  };

  // The chapter the player is currently working through (for the home note).
  const nextChapter = CHAPTERS.find((c) => c.levels.some((l) => (progress.stars[l.id] ?? 0) === 0));
  const adventureNote = nextChapter
    ? `${nextChapter.name} · ${nextChapter.levels.filter((l) => (progress.stars[l.id] ?? 0) > 0).length}/${nextChapter.levels.length}`
    : 'All chapters clear!';

  // A soft, theme-safe background tint for the play area. Transparent at the
  // bottom so the ambient scenery shows through beneath the board.
  const bgFor = (tint: string) =>
    `radial-gradient(135% 95% at 50% -20%, ${tint}3a, transparent 62%)`;
  const PRACTICE_TINT: Record<Difficulty, string> = {
    easy: '#9ccc65',
    medium: '#6fb7e0',
    hard: '#a78bfa',
    expert: '#ffd66b',
  };

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
          effectShape={effectShape}
          fillToken={fillToken}
          mascot={mascot}
          background={bgFor('#7bc47f')}
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
            const reward = dailyReward(next.streak);
            const solved = markSolved(progress, puzzle.id);
            const granted = grantGoals({ ...solved, bamboo: solved.bamboo + reward }, next);
            setProgress(granted.progress);
            return {
              streak: next.streak,
              puzzleNumber: num,
              bambooEarned: reward,
              goals: granted.goals,
            };
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
          effectShape={effectShape}
          fillToken={fillToken}
          mascot={mascot}
          background={bgFor(chapterOfLevel(level.id)?.tint ?? '#7bc47f')}
          bamboo={progress.bamboo}
          onSpendBamboo={spendBamboo}
          subtitle={`Level ${idx + 1}`}
          onSolved={(timeMs): RevealInfo => {
            const result = completeLevel(progress, level, timeMs);
            const granted = grantGoals(markSolved(result.progress, puzzle.id), stats);
            setProgress(granted.progress);
            return {
              stars: result.stars,
              bambooEarned: result.bambooEarned,
              goals: granted.goals,
            };
          }}
          onHome={goHome}
          onNext={next ? () => startLevel(next.id) : undefined}
          nextLabel="Next level"
        />
      );
    }

    if (session.kind === 'event') {
      const event = eventById(session.eventId);
      const puzzle = puzzleById(session.puzzleId);
      if (!event || !puzzle) return null;
      const idx = event.puzzleIds.indexOf(puzzle.id);
      const nextPid =
        event.puzzleIds.length > 1
          ? event.puzzleIds[(idx + 1) % event.puzzleIds.length]
          : undefined;
      return (
        <GameScreen
          key={`event-${event.id}-${puzzle.id}`}
          puzzle={puzzle}
          mode="event"
          settings={settings}
          effectColors={effectColors}
          effectShape={effectShape}
          fillToken={fillToken}
          mascot={mascot}
          background={bgFor('#ffcf6b')}
          bamboo={progress.bamboo}
          onSpendBamboo={spendBamboo}
          subtitle={event.name}
          onSolved={(): RevealInfo => {
            // Figure out which exclusive rewards this solve unlocks (if it
            // completes the event's whole pack) so the reveal can celebrate them.
            const before = progress.claimedEvents;
            const after = markSolved(progress, puzzle.id);
            const newlyClaimed = after.claimedEvents.filter((id) => !before.includes(id));
            const unlocked = newlyClaimed
              .flatMap((id) => eventById(id)?.rewardCosmetics ?? [])
              .map((cid) => cosmeticById(cid))
              .filter((c): c is NonNullable<typeof c> => Boolean(c))
              .map((c) => ({ icon: c.icon, name: c.name }));
            // Events pay double bamboo while they're in season.
            const granted = grantGoals({ ...after, bamboo: after.bamboo + 30 }, stats);
            setProgress(granted.progress);
            return {
              bambooEarned: 30,
              unlocked: unlocked.length ? unlocked : undefined,
              goals: granted.goals,
            };
          }}
          onHome={goHome}
          onNext={nextPid ? () => startEvent(event.id, nextPid) : undefined}
          nextLabel="Next puzzle"
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
        effectShape={effectShape}
        fillToken={fillToken}
        mascot={mascot}
        background={bgFor(PRACTICE_TINT[session.difficulty])}
        bamboo={progress.bamboo}
        onSpendBamboo={spendBamboo}
        subtitle="Practice"
        onSolved={(): RevealInfo => {
          const solved = markSolved(progress, puzzle.id);
          const granted = grantGoals({ ...solved, bamboo: solved.bamboo + 5 }, stats);
          setProgress(granted.progress);
          return { bambooEarned: 5, goals: granted.goals };
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
      <Scenery />
      {screen === 'home' && (
        <HomeScreen
          onNavigate={(s) => (s === 'daily' ? startDaily() : setScreen(s))}
          bamboo={progress.bamboo}
          streak={stats.streak}
          mascot={mascot}
          dailyDone={dailyDone}
          activeEventCount={activeEvents().length}
          adventureNote={adventureNote}
          reducedMotion={settings.reducedMotion}
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
      {screen === 'gacha' && (
        <GachaScreen
          progress={progress}
          onPull={doPull}
          reducedMotion={settings.reducedMotion}
          onHome={goHome}
        />
      )}
      {screen === 'arcade' && (
        <ArcadeScreen playsToday={arcadePlays} onPlay={(g) => setScreen(g)} onHome={goHome} />
      )}
      {screen === 'pairs' && (
        <PairsGame
          reducedMotion={settings.reducedMotion}
          onBack={() => setScreen('arcade')}
          onWin={(misses) => {
            const amount = arcadeReward('pairs', Math.max(8, 24 - 2 * misses), 4);
            setProgress((p) => ({ ...p, bamboo: p.bamboo + amount }));
            return amount;
          }}
        />
      )}
      {screen === 'lightning' && (
        <LightningGame
          settings={settings}
          fillToken={fillToken}
          onBack={() => setScreen('arcade')}
          onWin={(puzzleId) => {
            const amount = arcadeReward('lightning', 20, 5);
            const solved = markSolved(progress, puzzleId);
            const granted = grantGoals({ ...solved, bamboo: solved.bamboo + amount }, stats);
            setProgress(granted.progress);
            return amount;
          }}
        />
      )}
      {screen === 'help' && <HowToPlay onClose={goHome} />}
    </div>
  );
}
