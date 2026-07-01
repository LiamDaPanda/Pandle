import { activeEvents, EVENTS, GameEvent } from '../data/events';
import { puzzleById } from '../data/puzzles';
import { Progress } from '../state/progress';
import { cosmeticById } from '../data/cosmetics';

interface EventsScreenProps {
  progress: Progress;
  onPlayEventPuzzle: (eventId: string, puzzleId: string) => void;
  onHome: () => void;
}

function EventCard({
  event,
  live,
  progress,
  onPlay,
}: {
  event: GameEvent;
  live: boolean;
  progress: Progress;
  onPlay: (puzzleId: string) => void;
}) {
  return (
    <section className={`event-card ${live ? 'live' : 'ended'}`}>
      <div className="event-head">
        <span className="event-emoji">{event.emoji}</span>
        <div>
          <h3>{event.name}</h3>
          <p className="event-theme">{event.theme}</p>
        </div>
        <span className={`event-badge ${live ? 'on' : ''}`}>{live ? 'LIVE' : 'Ended'}</span>
      </div>
      <div className="event-puzzles">
        {event.puzzleIds.map((pid) => {
          const puzzle = puzzleById(pid);
          if (!puzzle) return null;
          return (
            <button
              key={pid}
              className="event-puzzle"
              disabled={!live}
              onClick={() => onPlay(pid)}
            >
              {puzzle.emoji} {puzzle.name}
            </button>
          );
        })}
      </div>
      <p className="event-reward">
        Reward:{' '}
        {event.rewardCosmetics
          .map((id) => cosmeticById(id))
          .filter(Boolean)
          .map((c) => `${c!.emoji} ${c!.name}`)
          .join(', ')}
        {progress.claimedEvents.includes(event.id) ? ' ✓' : ''}
      </p>
    </section>
  );
}

export function EventsScreen({ progress, onPlayEventPuzzle, onHome }: EventsScreenProps) {
  const live = activeEvents();
  const liveIds = new Set(live.map((e) => e.id));

  return (
    <div className="screen">
      <header className="screen-header">
        <button className="btn btn-ghost btn-small" onClick={onHome}>
          ← Home
        </button>
        <h2>Events 🎉</h2>
        <span />
      </header>
      <div className="events">
        {EVENTS.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            live={liveIds.has(event.id)}
            progress={progress}
            onPlay={(pid) => onPlayEventPuzzle(event.id, pid)}
          />
        ))}
      </div>
    </div>
  );
}
