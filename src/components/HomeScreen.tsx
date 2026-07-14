import { Screen } from '../App';
import { cosmeticById } from '../data/cosmetics';
import { Icon, IconName } from './Icon';

interface HomeScreenProps {
  onNavigate: (s: Screen) => void;
  bamboo: number;
  streak: number;
  mascot: IconName;
  dailyDone: boolean;
  activeEventCount: number;
  /** Progress note for the Adventure card, e.g. "Toy Chest · 3/6". */
  adventureNote: string;
  reducedMotion: boolean;
}

const AMBIENT = [
  { left: '8%', size: '20px', dur: '9s', delay: '0s' },
  { left: '24%', size: '14px', dur: '12s', delay: '3s' },
  { left: '46%', size: '22px', dur: '10s', delay: '1.5s' },
  { left: '68%', size: '16px', dur: '13s', delay: '5s' },
  { left: '85%', size: '18px', dur: '11s', delay: '2.5s' },
];

const MORNING = [
  'Good morning! A fresh puzzle is waiting.',
  'Morning! The grove is quiet and the grids are fresh.',
  'Rise and shine — bamboo for breakfast?',
];
const AFTERNOON = [
  'Good afternoon! Time for a little puzzle break?',
  'A puzzle a day keeps the panda happy.',
  'Lovely day for finding hidden pictures.',
];
const EVENING = [
  'Good evening! One cozy puzzle before dinner?',
  'Evenings are for slow, happy solving.',
  'The fireflies are out — so are the puzzles.',
];
const NIGHT = [
  'Up late? One quiet puzzle, then bed.',
  'Night owl! The grove is peaceful at this hour.',
  'The pandas are asleep — solve softly.',
];
const DAILY_DONE = [
  'All done for today — see you tomorrow!',
  'Daily puzzle: solved. Enjoy the rest of your day.',
];

/** A warm, time-aware line from the mascot. Stable for a whole day. */
export function greetingFor(date: Date, streak: number, dailyDone: boolean): string {
  const day = Math.floor(date.getTime() / 86400000);
  if (dailyDone) {
    if (streak >= 3) return `${streak} days in a row — you're amazing!`;
    return DAILY_DONE[day % DAILY_DONE.length];
  }
  if (streak >= 3 && day % 3 === 0) return `Day ${streak} of your streak — keep it cozy!`;
  const h = date.getHours();
  const bucket = h < 5 ? NIGHT : h < 12 ? MORNING : h < 17 ? AFTERNOON : h < 22 ? EVENING : NIGHT;
  return bucket[day % bucket.length];
}

export function HomeScreen({
  onNavigate,
  bamboo,
  streak,
  mascot,
  dailyDone,
  activeEventCount,
  adventureNote,
  reducedMotion,
}: HomeScreenProps) {
  return (
    <div className="home">
      {!reducedMotion && (
        <div className="ambient" aria-hidden="true">
          {AMBIENT.map((a, i) => (
            <span
              key={i}
              className="ambient-leaf"
              style={{
                left: a.left,
                animationDuration: a.dur,
                animationDelay: a.delay,
                width: a.size,
                height: a.size,
              }}
            >
              <Icon name="leaf" size={a.size} />
            </span>
          ))}
        </div>
      )}
      <div className="home-top">
        <span className="chip">
          <Icon name="bamboo" /> {bamboo}
        </span>
        {streak > 0 && (
          <span className="chip">
            <Icon name="flame" /> {streak}
          </span>
        )}
      </div>

      <div className="hero">
        <p className="speech">{greetingFor(new Date(), streak, dailyDone)}</p>
        <div className="mascot-badge">
          <span className="badge-sprig left" aria-hidden="true">
            <Icon name="bamboo-tall" size="2.2rem" />
          </span>
          <div className="mascot">
            <Icon name={mascot} size="4.6rem" />
          </div>
          <span className="badge-sprig right" aria-hidden="true">
            <Icon name="bamboo-tall" size="2.2rem" />
          </span>
        </div>
        <h1 className="logo">Pandle</h1>
        <p className="tagline">Fill the grid. Find the little picture hiding inside.</p>
      </div>

      <div className="menu">
        <button className="menu-btn primary" onClick={() => onNavigate('daily')}>
          <span className="menu-emoji"><Icon name="calendar" size="2rem" /></span>
          <span className="menu-label">Daily Puzzle</span>
          <span className="menu-note">
            {dailyDone
              ? 'Nice — see you tomorrow'
              : streak > 0
                ? `Keep the ${streak}-day streak alive`
                : "Today's is ready"}
          </span>
        </button>
        <button className="menu-btn" onClick={() => onNavigate('levels')}>
          <span className="menu-emoji"><Icon name="map" size="2rem" /></span>
          <span className="menu-label">Adventure</span>
          <span className="menu-note">{adventureNote}</span>
        </button>
        <button className="menu-btn" onClick={() => onNavigate('events')}>
          <span className="menu-emoji"><Icon name="party" size="2rem" /></span>
          <span className="menu-label">Events</span>
          <span className="menu-note">
            {activeEventCount > 0 ? `${activeEventCount} in season` : 'Seasonal'}
          </span>
        </button>
        <button className="menu-btn" onClick={() => onNavigate('practice')}>
          <span className="menu-emoji"><Icon name="infinity" size="2rem" /></span>
          <span className="menu-label">Practice</span>
          <span className="menu-note">One more, anytime</span>
        </button>
        <button className="menu-btn" onClick={() => onNavigate('customize')}>
          <span className="menu-emoji"><Icon name="palette" size="2rem" /></span>
          <span className="menu-label">Customize</span>
          <span className="menu-note">Make it yours</span>
        </button>
        <button className="menu-btn" onClick={() => onNavigate('gacha')}>
          <span className="menu-emoji"><Icon name="gift" size="2rem" /></span>
          <span className="menu-label">Lucky Capsules</span>
          <span className="menu-note">Feeling lucky?</span>
        </button>
        <button className="menu-btn" onClick={() => onNavigate('stats')}>
          <span className="menu-emoji"><Icon name="chart" size="2rem" /></span>
          <span className="menu-label">Stats</span>
          <span className="menu-note">Streaks & records</span>
        </button>
      </div>

      <button className="link-btn" onClick={() => onNavigate('help')}>
        New here? How to play
      </button>
    </div>
  );
}

/** Look up the mascot art icon for an equipped skin id. */
export function mascotFor(skinId: string): IconName {
  return cosmeticById(skinId)?.mascot ?? 'panda';
}
