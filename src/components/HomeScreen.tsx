import { Screen } from '../App';
import { cosmeticById } from '../data/cosmetics';

interface HomeScreenProps {
  onNavigate: (s: Screen) => void;
  bamboo: number;
  streak: number;
  mascot: string;
  dailyDone: boolean;
  activeEventCount: number;
}

export function HomeScreen({
  onNavigate,
  bamboo,
  streak,
  mascot,
  dailyDone,
  activeEventCount,
}: HomeScreenProps) {
  return (
    <div className="home">
      <div className="home-top">
        <span className="chip">🎋 {bamboo}</span>
        {streak > 0 && <span className="chip">🔥 {streak}</span>}
      </div>

      <div className="hero">
        <div className="mascot">{mascot}</div>
        <h1 className="logo">Pandle</h1>
        <p className="tagline">Solve by logic. Reveal the panda.</p>
      </div>

      <div className="menu">
        <button className="menu-btn primary" onClick={() => onNavigate('daily')}>
          <span className="menu-emoji">📅</span>
          <span className="menu-label">Daily Puzzle</span>
          <span className="menu-note">{dailyDone ? 'Solved ✓' : 'New today!'}</span>
        </button>
        <button className="menu-btn" onClick={() => onNavigate('levels')}>
          <span className="menu-emoji">🗺️</span>
          <span className="menu-label">Adventure</span>
          <span className="menu-note">Level up</span>
        </button>
        <button className="menu-btn" onClick={() => onNavigate('events')}>
          <span className="menu-emoji">🎉</span>
          <span className="menu-label">Events</span>
          <span className="menu-note">
            {activeEventCount > 0 ? `${activeEventCount} live` : 'Check back'}
          </span>
        </button>
        <button className="menu-btn" onClick={() => onNavigate('practice')}>
          <span className="menu-emoji">♾️</span>
          <span className="menu-label">Practice</span>
          <span className="menu-note">Play freely</span>
        </button>
        <button className="menu-btn" onClick={() => onNavigate('customize')}>
          <span className="menu-emoji">🎨</span>
          <span className="menu-label">Customize</span>
          <span className="menu-note">Themes & skins</span>
        </button>
        <button className="menu-btn" onClick={() => onNavigate('stats')}>
          <span className="menu-emoji">📊</span>
          <span className="menu-label">Stats</span>
          <span className="menu-note">Your streaks</span>
        </button>
      </div>

      <button className="link-btn" onClick={() => onNavigate('help')}>
        How to play?
      </button>
    </div>
  );
}

/** Helper so the mascot emoji can be looked up from an equipped skin id. */
export function mascotFor(skinId: string): string {
  return cosmeticById(skinId)?.mascot ?? '🐼';
}
