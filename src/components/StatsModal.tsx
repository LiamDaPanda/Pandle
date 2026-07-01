import { Stats } from '../state/stats';
import { Progress, totalStars } from '../state/progress';
import { ALL_LEVELS } from '../data/levels';
import { formatTime } from '../game/share';
import { Icon, IconName } from './Icon';

interface StatsScreenProps {
  stats: Stats;
  progress: Progress;
  onHome: () => void;
}

export function StatsScreen({ stats, progress, onHome }: StatsScreenProps) {
  const winRate = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
  const maxStars = ALL_LEVELS.length * 3;

  const cards: { label: string; value: string; icon?: IconName }[] = [
    { label: 'Current streak', value: `${stats.streak}`, icon: 'flame' },
    { label: 'Best streak', value: `${stats.maxStreak}` },
    { label: 'Daily wins', value: `${stats.wins}` },
    { label: 'Win rate', value: `${winRate}%` },
    { label: 'Best time', value: stats.bestTimeMs ? formatTime(stats.bestTimeMs) : '—' },
    { label: 'Stars', value: `${totalStars(progress)}/${maxStars}`, icon: 'star' },
    { label: 'Bamboo', value: `${progress.bamboo}`, icon: 'bamboo' },
    { label: 'Cosmetics', value: `${progress.ownedCosmetics.length}`, icon: 'palette' },
  ];

  return (
    <div className="screen">
      <header className="screen-header">
        <button className="btn btn-ghost btn-small" onClick={onHome}>
          <Icon name="back" /> Home
        </button>
        <h2>Stats</h2>
        <span />
      </header>
      <div className="stats-grid">
        {cards.map((c) => (
          <div key={c.label} className="stat-card">
            <div className="stat-value">
              {c.icon && <Icon name={c.icon} />} {c.value}
            </div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
