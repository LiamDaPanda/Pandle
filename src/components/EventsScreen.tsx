import { EVENTS, GameEvent, isEventLive, nextOpenMonth, daysLeftInSeason } from '../data/events';
import { puzzleById } from '../data/puzzles';
import { Progress, eventProgress } from '../state/progress';
import { cosmeticById } from '../data/cosmetics';
import { Icon } from './Icon';

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
  const rewards = event.rewardCosmetics.map((id) => cosmeticById(id)).filter(Boolean);
  const prog = eventProgress(progress, event);
  const earned = progress.claimedEvents.includes(event.id);
  const daysLeft = live ? daysLeftInSeason(event) : 0;
  return (
    <section className={`event-card ${live ? 'live' : 'ended'}`}>
      <div className="event-head">
        <span className="event-emoji">
          <Icon name={event.icon} size="2rem" />
        </span>
        <div>
          <h3>{event.name}</h3>
          <p className="event-theme">{event.theme}</p>
        </div>
        <span className={`event-badge ${live ? 'on' : ''}`}>
          {live ? 'IN SEASON' : `back in ${nextOpenMonth(event)}`}
        </span>
      </div>

      {live && (
        <p className="event-countdown">
          <Icon name="flame" /> Ends in {daysLeft} day{daysLeft === 1 ? '' : 's'}
        </p>
      )}

      <div className="event-progress">
        <div className="event-bar">
          <span style={{ width: `${(prog.done / prog.total) * 100}%` }} />
        </div>
        <span className="event-count">
          {prog.done}/{prog.total}
        </span>
      </div>

      <div className="event-puzzles">
        {event.puzzleIds.map((pid) => {
          const puzzle = puzzleById(pid);
          if (!puzzle) return null;
          const done = progress.solvedPuzzles.includes(pid);
          return (
            <button
              key={pid}
              className={`event-puzzle ${done ? 'done' : ''}`}
              disabled={!live}
              onClick={() => onPlay(pid)}
            >
              <Icon name={done ? 'star' : puzzle.icon} /> {puzzle.name}
            </button>
          );
        })}
      </div>

      <p className={`event-reward ${earned ? 'earned' : ''}`}>
        <span className="reward-label">{earned ? 'Earned:' : 'Exclusive reward:'}</span>{' '}
        {rewards.map((c) => (
          <span key={c!.id} className="reward-item">
            <Icon name={c!.icon} /> {c!.name}
          </span>
        ))}
        {earned && <Icon name="star" />}
      </p>
    </section>
  );
}

export function EventsScreen({ progress, onPlayEventPuzzle, onHome }: EventsScreenProps) {
  // In-season events first, then the rest by when they next return.
  const ordered = [...EVENTS].sort((a, b) => {
    const la = isEventLive(a) ? 0 : 1;
    const lb = isEventLive(b) ? 0 : 1;
    return la - lb;
  });
  const liveCount = ordered.filter((e) => isEventLive(e)).length;

  return (
    <div className="screen">
      <header className="screen-header">
        <button className="btn btn-ghost btn-small" onClick={onHome}>
          <Icon name="back" /> Home
        </button>
        <h2>Events</h2>
        <span />
      </header>
      <p className="screen-intro">
        {liveCount > 0
          ? `${liveCount} event${liveCount > 1 ? 's' : ''} in season right now. Rewards only stick around while they’re live.`
          : 'Nothing running this week — check back as the seasons turn.'}
      </p>
      <div className="events">
        {ordered.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            live={isEventLive(event)}
            progress={progress}
            onPlay={(pid) => onPlayEventPuzzle(event.id, pid)}
          />
        ))}
      </div>
    </div>
  );
}
