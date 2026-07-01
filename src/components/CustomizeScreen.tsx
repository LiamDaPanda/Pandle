import { EFFECTS, SKINS, THEMES, Cosmetic } from '../data/cosmetics';
import { Progress, buyCosmetic, equipCosmetic } from '../state/progress';
import { Settings } from '../state/settings';
import { Icon, IconName } from './Icon';

interface CustomizeScreenProps {
  progress: Progress;
  settings: Settings;
  onProgress: (p: Progress) => void;
  onSettings: (s: Settings) => void;
  onHome: () => void;
}

function Item({
  cosmetic,
  progress,
  onBuy,
  onEquip,
}: {
  cosmetic: Cosmetic;
  progress: Progress;
  onBuy: (id: string) => void;
  onEquip: (id: string) => void;
}) {
  const owned = progress.ownedCosmetics.includes(cosmetic.id);
  const equipped = progress.equipped[cosmetic.kind] === cosmetic.id;
  const affordable = progress.bamboo >= cosmetic.cost;

  return (
    <div className={`shop-item ${equipped ? 'equipped' : ''}`}>
      <div
        className="shop-swatch"
        style={
          cosmetic.theme
            ? { background: cosmetic.theme['--bg'], color: cosmetic.theme['--ink'] }
            : { background: 'var(--accent-soft)' }
        }
      >
        <Icon name={cosmetic.icon} size="2rem" />
      </div>
      <div className="shop-name">{cosmetic.name}</div>
      {owned ? (
        <button
          className={`btn btn-small ${equipped ? 'btn-ghost' : 'btn-primary'}`}
          disabled={equipped}
          onClick={() => onEquip(cosmetic.id)}
        >
          {equipped ? 'Equipped' : 'Equip'}
        </button>
      ) : (
        <button
          className="btn btn-small btn-primary"
          disabled={!affordable}
          onClick={() => onBuy(cosmetic.id)}
        >
          <Icon name="bamboo" /> {cosmetic.cost}
        </button>
      )}
    </div>
  );
}

export function CustomizeScreen({
  progress,
  settings,
  onProgress,
  onSettings,
  onHome,
}: CustomizeScreenProps) {
  const buy = (id: string) => {
    const next = buyCosmetic(progress, id);
    if (next) onProgress(equipCosmetic(next, id));
  };
  const equip = (id: string) => onProgress(equipCosmetic(progress, id));

  const groups: { title: string; icon: IconName; items: Cosmetic[] }[] = [
    { title: 'Themes', icon: 'palette', items: THEMES },
    { title: 'Effects', icon: 'confetti', items: EFFECTS },
    { title: 'Skins', icon: 'panda', items: SKINS },
  ];

  return (
    <div className="screen">
      <header className="screen-header">
        <button className="btn btn-ghost btn-small" onClick={onHome}>
          <Icon name="back" /> Home
        </button>
        <h2>Customize</h2>
        <span className="chip">
          <Icon name="bamboo" /> {progress.bamboo}
        </span>
      </header>

      {groups.map((g) => (
        <section key={g.title} className="shop-group">
          <h3>
            <Icon name={g.icon} /> {g.title}
          </h3>
          <div className="shop-grid">
            {g.items.map((c) => (
              <Item key={c.id} cosmetic={c} progress={progress} onBuy={buy} onEquip={equip} />
            ))}
          </div>
        </section>
      ))}

      <section className="shop-group">
        <h3>Accessibility</h3>
        <label className="toggle-row">
          <span>Sound effects</span>
          <input
            type="checkbox"
            checked={!settings.muted}
            onChange={(e) => onSettings({ ...settings, muted: !e.target.checked })}
          />
        </label>
        <label className="toggle-row">
          <span>Reduced motion (fewer effects)</span>
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => onSettings({ ...settings, reducedMotion: e.target.checked })}
          />
        </label>
        <label className="toggle-row">
          <span>Start in Cross mode</span>
          <input
            type="checkbox"
            checked={settings.defaultPaintMode === 'cross'}
            onChange={(e) =>
              onSettings({ ...settings, defaultPaintMode: e.target.checked ? 'cross' : 'fill' })
            }
          />
        </label>
      </section>
    </div>
  );
}
