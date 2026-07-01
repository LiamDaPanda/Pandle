import { Stats } from '../state/stats';
import { Progress, totalStars } from '../state/progress';
import { ALL_LEVELS } from '../data/levels';
import { formatTime } from '../game/share';

interface StatsScreenProps {
  stats: Stats;
  progress: Progress;
  onHome: () => void;
}

export function StatsScreen({ stats, progress, onHome }: StatsScreenProps) {
  const winRate = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
  const maxStars = ALL_LEVELS.length * 3;

  const cards = [
    { label: 'Current streak', value: `🔥 ${stats.streak}` },
    { label: 'Best streak', value: `${stats.maxStreak}` },
    { label: 'Daily wins', value: `${stats.wins}` },
    { label: 'Win rate', value: `${winRate}%` },
    { label: 'Best time', value: stats.bestTimeMs ? formatTime(stats.bestTimeMs) : '—' },
    { label: 'Stars', value: `⭐ ${totalStars(progress)}/${maxStars}` },
    { label: 'Bamboo', value: `🎋 ${progress.bamboo}` },
    { label: 'Cosmetics', value: `🎨 ${progress.ownedCosmetics.length}` },
  ];

  return (
    <div className="screen">
      <header className="screen-header">
        <button className="btn btn-ghost btn-small" onClick={onHome}>
          ← Home
        </button>
        <h2>Stats 📊</h2>
        <span />
      </header>
      <div className="stats-grid">
        {cards.map((c) => (
          <div key={c.label} className="stat-card">
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
