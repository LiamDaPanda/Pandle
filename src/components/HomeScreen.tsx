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
  reducedMotion: boolean;
}

const AMBIENT = [
  { left: '8%', size: '20px', dur: '9s', delay: '0s' },
  { left: '24%', size: '14px', dur: '12s', delay: '3s' },
  { left: '46%', size: '22px', dur: '10s', delay: '1.5s' },
  { left: '68%', size: '16px', dur: '13s', delay: '5s' },
  { left: '85%', size: '18px', dur: '11s', delay: '2.5s' },
];

export function HomeScreen({
  onNavigate,
  bamboo,
  streak,
  mascot,
  dailyDone,
  activeEventCount,
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
          <span className="menu-note">{dailyDone ? 'Nice — see you tomorrow' : "Today's is ready"}</span>
        </button>
        <button className="menu-btn" onClick={() => onNavigate('levels')}>
          <span className="menu-emoji"><Icon name="map" size="2rem" /></span>
          <span className="menu-label">Adventure</span>
          <span className="menu-note">Chapter by chapter</span>
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
