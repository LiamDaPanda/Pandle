import { useState } from 'react';
import { Progress } from '../state/progress';
import { GACHA_COST, GACHA_PITY, GachaResult, gachaPool } from '../game/gacha';
import { celebrate } from '../effects/celebrate';
import { playGachaCrank, playGachaPop, playJackpot } from '../effects/sound';
import { Icon } from './Icon';

interface GachaScreenProps {
  progress: Progress;
  /** Perform one pull; returns the result, or null if unaffordable. */
  onPull: () => GachaResult | null;
  reducedMotion: boolean;
  onHome: () => void;
}

/** The capsule machine, drawn as flat kawaii SVG. */
function Machine({ shaking }: { shaking: boolean }) {
  return (
    <svg
      className={`gacha-machine ${shaking ? 'shaking' : ''}`}
      viewBox="0 0 120 150"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* glass dome */}
      <circle cx="60" cy="52" r="42" fill="#dff0f7" stroke="#b7d8e6" strokeWidth="2" />
      {/* capsules inside */}
      <circle cx="42" cy="62" r="11" fill="#ffb7c5" />
      <path d="M31 62a11 11 0 0122 0z" fill="#fbfbfb" />
      <circle cx="66" cy="70" r="11" fill="#ffd66b" />
      <path d="M55 70a11 11 0 0122 0z" fill="#fbfbfb" />
      <circle cx="82" cy="54" r="11" fill="#8ecae6" />
      <path d="M71 54a11 11 0 0122 0z" fill="#fbfbfb" />
      <circle cx="52" cy="40" r="11" fill="#7bc47f" />
      <path d="M41 40a11 11 0 0122 0z" fill="#fbfbfb" />
      {/* dome shine */}
      <path d="M30 32q10-14 26-14" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      {/* body */}
      <rect x="22" y="92" width="76" height="46" rx="10" fill="#e8615a" />
      <rect x="22" y="92" width="76" height="10" fill="#d14e48" />
      {/* dispense slot */}
      <rect x="38" y="112" width="26" height="16" rx="5" fill="#9e3833" />
      {/* crank */}
      <circle cx="82" cy="118" r="9" fill="#fbfbfb" stroke="#d14e48" strokeWidth="2" />
      <rect x="79.5" y="111" width="5" height="14" rx="2.5" fill="#d14e48" />
      {/* feet */}
      <rect x="28" y="138" width="14" height="6" rx="3" fill="#9e3833" />
      <rect x="78" y="138" width="14" height="6" rx="3" fill="#9e3833" />
    </svg>
  );
}

export function GachaScreen({ progress, onPull, reducedMotion, onHome }: GachaScreenProps) {
  const [phase, setPhase] = useState<'idle' | 'shaking' | 'result'>('idle');
  const [result, setResult] = useState<GachaResult | null>(null);

  const pool = gachaPool(progress);
  const pityLeft = GACHA_PITY - (progress.gachaPity ?? 0);
  const canPull = progress.bamboo >= GACHA_COST && phase !== 'shaking';

  const pull = () => {
    if (!canPull) return;
    playGachaCrank();
    setPhase('shaking');
    setResult(null);
    setTimeout(() => {
      const r = onPull();
      if (!r) {
        setPhase('idle');
        return;
      }
      setResult(r);
      setPhase('result');
      if (r.kind === 'cosmetic' || r.kind === 'jackpot') {
        playJackpot();
        celebrate(['#ffd66b', '#ffb7c5', '#8ecae6', '#7bc47f'], 'star', reducedMotion);
      } else {
        playGachaPop();
      }
    }, 700);
  };

  return (
    <div className="screen">
      <header className="screen-header">
        <button className="btn btn-ghost btn-small" onClick={onHome}>
          <Icon name="back" /> Home
        </button>
        <h2>Lucky Capsules</h2>
        <span className="chip">
          <Icon name="bamboo" /> {progress.bamboo}
        </span>
      </header>
      <p className="screen-intro">
        Every capsule holds bamboo or a surprise cosmetic.
        {pool.length > 0
          ? ` A cosmetic is guaranteed within ${pityLeft} pull${pityLeft === 1 ? '' : 's'}.`
          : ' You own every capsule cosmetic — pulls pay out big bamboo instead!'}
      </p>

      <div className="gacha-stage">
        <Machine shaking={phase === 'shaking'} />

        {phase === 'result' && result && (
          <div className="gacha-result" role="status">
            {result.kind === 'cosmetic' ? (
              <>
                <span className="gacha-result-icon">
                  <Icon name={result.cosmetic.icon} size="3rem" />
                </span>
                <span className="gacha-result-name">{result.cosmetic.name}</span>
                <span className="gacha-result-kind">New cosmetic unlocked!</span>
              </>
            ) : (
              <>
                <span className="gacha-result-icon">
                  <Icon name="bamboo" size="3rem" />
                </span>
                <span className="gacha-result-name">+{result.amount} bamboo</span>
                <span className="gacha-result-kind">
                  {result.kind === 'jackpot' ? 'Jackpot!' : 'A tidy bundle.'}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      <button className="btn btn-primary gacha-pull" disabled={!canPull} onClick={pull}>
        {phase === 'shaking' ? (
          'Cranking…'
        ) : (
          <>
            Pull <Icon name="bamboo" /> {GACHA_COST}
          </>
        )}
      </button>
      {progress.bamboo < GACHA_COST && (
        <p className="gacha-hint">Solve puzzles to earn more bamboo, then come try your luck.</p>
      )}
      {pool.length > 0 && (
        <p className="gacha-hint">
          {pool.length} cosmetic{pool.length === 1 ? '' : 's'} still hiding in the machine.
        </p>
      )}
    </div>
  );
}
