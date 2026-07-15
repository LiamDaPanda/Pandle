import { Icon } from './Icon';

export type ArcadeGame = 'pairs' | 'lightning';

interface ArcadeScreenProps {
  /** Rewarded wins today per game (full bonus is once daily). */
  playsToday: Record<ArcadeGame, number>;
  onPlay: (game: ArcadeGame) => void;
  onHome: () => void;
}

export function ArcadeScreen({ playsToday, onPlay, onHome }: ArcadeScreenProps) {
  const games: {
    id: ArcadeGame;
    name: string;
    desc: string;
    icon: Parameters<typeof Icon>[0]['name'];
  }[] = [
    {
      id: 'pairs',
      name: 'Panda Pairs',
      desc: 'Flip cards, match the critters. Fewer misses, more bamboo.',
      icon: 'panda',
    },
    {
      id: 'lightning',
      name: 'Lightning Round',
      desc: 'One small puzzle, ninety seconds. Beat the clock.',
      icon: 'flame',
    },
  ];

  return (
    <div className="screen">
      <header className="screen-header">
        <button className="btn btn-ghost btn-small" onClick={onHome}>
          <Icon name="back" /> Home
        </button>
        <h2>Arcade</h2>
        <span />
      </header>
      <p className="screen-intro">
        Quick games, real bamboo. The first win of each game every day pays a full bonus.
      </p>
      <div className="arcade-list">
        {games.map((g) => (
          <button key={g.id} className="arcade-card" onClick={() => onPlay(g.id)}>
            <span className="arcade-icon">
              <Icon name={g.icon} size="2.6rem" />
            </span>
            <span className="arcade-body">
              <span className="arcade-name">{g.name}</span>
              <span className="arcade-desc">{g.desc}</span>
            </span>
            <span className={`arcade-bonus ${playsToday[g.id] === 0 ? 'fresh' : ''}`}>
              {playsToday[g.id] === 0 ? 'Daily bonus!' : 'Bonus claimed'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
