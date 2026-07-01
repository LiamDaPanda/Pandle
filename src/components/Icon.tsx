import { ReactNode } from 'react';

export type IconName =
  // nav / ui
  | 'back' | 'calendar' | 'map' | 'party' | 'infinity' | 'palette' | 'chart'
  | 'bulb' | 'undo' | 'dice' | 'flame' | 'star' | 'star-outline' | 'lock'
  | 'question' | 'mountain'
  // items / currency
  | 'bamboo' | 'bamboo-tall' | 'gem' | 'gift' | 'crown' | 'leaf' | 'clover'
  | 'heart' | 'cloud' | 'rice' | 'egg' | 'flower' | 'fish' | 'house' | 'tree'
  | 'cat' | 'moon' | 'cup' | 'duck' | 'ghost' | 'sakura' | 'confetti'
  // characters
  | 'panda' | 'panda-sleepy' | 'panda-hug' | 'koala' | 'red-panda'
  | 'polar-bear' | 'brown-bear' | 'sun' | 'wave'
  | 'tiger' | 'ninja' | 'fireworks' | 'planet'
  // board tokens
  | 'panda-token' | 'bamboo-token'
  | 'red-panda-token' | 'koala-token' | 'polar-token' | 'brown-token'
  | 'tiger-token' | 'ninja-token';

// palette
const K = '#2b2b2b'; // black
const W = '#fbfbfb'; // white
const G = '#7bc47f'; // bamboo green
const DG = '#4f9d54'; // dark green
const P = '#ffb7c5'; // pink
const Y = '#ffd66b'; // yellow
const O = '#f0913e'; // orange
const B = '#8ecae6'; // blue
const GR = '#b8bfc7'; // grey
const S = '#aab2ba'; // slate grey (koala)
const N = '#c98a5e'; // brown (bear)
const R = '#e8615a'; // red (ninja band)

/** Reusable panda face centred in a 24x24 box. */
function pandaFace(sleepy = false) {
  return (
    <>
      <circle cx="7.5" cy="7" r="3.4" fill={K} />
      <circle cx="16.5" cy="7" r="3.4" fill={K} />
      <circle cx="12" cy="13" r="8.2" fill={W} stroke={K} strokeWidth="1" />
      {sleepy ? (
        <>
          <path d="M6.5 12.5q2 2 4 0" fill="none" stroke={K} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M13.5 12.5q2 2 4 0" fill="none" stroke={K} strokeWidth="1.4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="8.6" cy="12.4" rx="2" ry="2.6" fill={K} />
          <ellipse cx="15.4" cy="12.4" rx="2" ry="2.6" fill={K} />
          <circle cx="8.9" cy="12.9" r="0.7" fill={W} />
          <circle cx="15.7" cy="12.9" r="0.7" fill={W} />
        </>
      )}
      <ellipse cx="12" cy="16.4" rx="1.5" ry="1.1" fill={K} />
      <circle cx="6.6" cy="16.2" r="1.3" fill={P} opacity="0.75" />
      <circle cx="17.4" cy="16.2" r="1.3" fill={P} opacity="0.75" />
    </>
  );
}

interface Critter {
  face: string;
  ear: string;
  nose: string;
  eye?: string;
  innerEar?: string;
  muzzle?: string;
  patch?: string; // panda-style eye patches
}

/** A round animal face token centred in a 24x24 box (used for board tokens + skins). */
function critter({ face, ear, nose, eye = K, innerEar, muzzle, patch }: Critter) {
  return (
    <>
      <circle cx="6" cy="6.5" r="3.4" fill={ear} />
      <circle cx="18" cy="6.5" r="3.4" fill={ear} />
      {innerEar && (
        <>
          <circle cx="6" cy="6.8" r="1.7" fill={innerEar} />
          <circle cx="18" cy="6.8" r="1.7" fill={innerEar} />
        </>
      )}
      <circle cx="12" cy="13" r="8.4" fill={face} />
      {muzzle && <ellipse cx="12" cy="15.2" rx="4.6" ry="3.7" fill={muzzle} />}
      {patch ? (
        <>
          <ellipse cx="8.4" cy="12" rx="2.1" ry="2.7" fill={patch} />
          <ellipse cx="15.6" cy="12" rx="2.1" ry="2.7" fill={patch} />
          <circle cx="8.7" cy="12.6" r="0.7" fill={face} />
          <circle cx="15.9" cy="12.6" r="0.7" fill={face} />
        </>
      ) : (
        <>
          <circle cx="8.7" cy="12" r="1.3" fill={eye} />
          <circle cx="15.3" cy="12" r="1.3" fill={eye} />
        </>
      )}
      <ellipse cx="12" cy="16.3" rx="1.6" ry="1.2" fill={nose} />
    </>
  );
}

/** Tiger face token (orange with stripes) in a 24x24 box. */
function tigerFace() {
  return (
    <>
      <circle cx="6" cy="6.5" r="3.2" fill={O} />
      <circle cx="18" cy="6.5" r="3.2" fill={O} />
      <circle cx="6" cy="6.8" r="1.4" fill={K} />
      <circle cx="18" cy="6.8" r="1.4" fill={K} />
      <circle cx="12" cy="13" r="8.4" fill={O} />
      <ellipse cx="12" cy="15.5" rx="4.4" ry="3.4" fill={W} />
      <path d="M4.5 10.5l1.4 2M6 8l1 2.4M19.5 10.5l-1.4 2M18 8l-1 2.4" stroke={K} strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="8.7" cy="12" r="1.3" fill={K} />
      <circle cx="15.3" cy="12" r="1.3" fill={K} />
      <ellipse cx="12" cy="16.2" rx="1.5" ry="1.1" fill={K} />
    </>
  );
}

/** Panda face wearing a red ninja headband. */
function ninjaFace() {
  return (
    <>
      <circle cx="6" cy="6.5" r="3.2" fill={K} />
      <circle cx="18" cy="6.5" r="3.2" fill={K} />
      <circle cx="12" cy="13" r="8.4" fill={W} />
      <ellipse cx="8.4" cy="14.5" rx="1.9" ry="2.3" fill={K} />
      <ellipse cx="15.6" cy="14.5" rx="1.9" ry="2.3" fill={K} />
      <circle cx="8.7" cy="15" r="0.6" fill={W} />
      <circle cx="15.9" cy="15" r="0.6" fill={W} />
      <ellipse cx="12" cy="18" rx="1.4" ry="1" fill={K} />
      <rect x="2.5" y="9.5" width="19" height="2.8" fill={R} />
      <path d="M21.5 9.5l3 -1v6l-3 -1.5z" fill={R} />
      <circle cx="12" cy="10.9" r="1" fill={W} />
    </>
  );
}

function bambooShape(tall = false) {
  return (
    <>
      <rect x={tall ? 9.5 : 9} y="2" width={tall ? 5 : 6} height="20" rx="2.5" fill={G} />
      <rect x={tall ? 9.5 : 9} y="8" width={tall ? 5 : 6} height="1.6" fill={DG} />
      <rect x={tall ? 9.5 : 9} y="14" width={tall ? 5 : 6} height="1.6" fill={DG} />
      <path d="M9 6q-5 0 -6 -3 4 -1 6 3z" fill={DG} />
      <path d="M15 12q5 0 6 -3 -4 -1 -6 3z" fill={DG} />
    </>
  );
}

const ICONS: Record<IconName, ReactNode> = {
  back: <path d="M14.5 5 8 12l6.5 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="3" fill="currentColor" opacity="0.15" />
      <rect x="3.5" y="5" width="17" height="15" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="14.5" r="1.6" fill="currentColor" />
    </>
  ),
  map: (
    <>
      <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" fill={G} opacity="0.9" />
      <path d="M9 4v16M15 6v16" stroke={DG} strokeWidth="1.4" />
    </>
  ),
  party: (
    <>
      <path d="M4 20l5-13 8 8z" fill={Y} />
      <path d="M4 20l3.5-1.2-2.3-2.3z" fill={O} />
      <circle cx="17" cy="5" r="1.3" fill={P} />
      <circle cx="20" cy="9" r="1.3" fill={B} />
      <circle cx="14" cy="3.5" r="1.1" fill={G} />
    </>
  ),
  infinity: <path d="M6 12c0-2.2 1.6-3.5 3-3.5 2.6 0 3.4 7 6 7 1.4 0 3-1.3 3-3.5S19.4 8.5 18 8.5c-2.6 0-3.4 7-6 7-1.4 0-3-1.3-3-3.5z" fill="none" stroke="currentColor" strokeWidth="2.1" />,
  palette: (
    <>
      <path d="M12 3a9 8 0 100 16c1 0 1.6-.7 1.6-1.5 0-1.4-1.2-1.3-1.2-2.6 0-.8.7-1.4 1.7-1.4H16a5 4 0 004-4C20 6 16.4 3 12 3z" fill={G} />
      <circle cx="8" cy="9" r="1.2" fill={P} />
      <circle cx="12" cy="7.5" r="1.2" fill={Y} />
      <circle cx="16" cy="9" r="1.2" fill={B} />
    </>
  ),
  chart: (
    <>
      <rect x="4" y="12" width="4" height="8" rx="1.2" fill={G} />
      <rect x="10" y="7" width="4" height="13" rx="1.2" fill={O} />
      <rect x="16" y="9" width="4" height="11" rx="1.2" fill={B} />
    </>
  ),
  bulb: (
    <>
      <path d="M12 3a6 6 0 00-3.6 10.8c.6.5 1 1 1.1 1.7h5c.1-.7.5-1.2 1.1-1.7A6 6 0 0012 3z" fill={Y} />
      <rect x="9.5" y="17" width="5" height="2" rx="1" fill={K} opacity="0.6" />
      <path d="M10 20.5h4" stroke={K} strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
    </>
  ),
  undo: <path d="M9 7H6V4M6.2 7a7 7 0 11-1.7 6" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />,
  dice: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4" fill={W} stroke={K} strokeWidth="1.4" />
      <circle cx="9" cy="9" r="1.4" fill={K} />
      <circle cx="15" cy="9" r="1.4" fill={K} />
      <circle cx="9" cy="15" r="1.4" fill={K} />
      <circle cx="15" cy="15" r="1.4" fill={K} />
      <circle cx="12" cy="12" r="1.4" fill={K} />
    </>
  ),
  flame: <path d="M12 2c1 3-2 4-2 7 0-1.5-1.5-2-1.5-2C7 9 6 11 6 13.5A6 6 0 0018 14c0-3-2-5-3.2-7.3C13.6 4.5 13 3 12 2z" fill={O} />,
  star: <path d="M12 3l2.6 5.5 6 .8-4.4 4.2 1.1 6L12 16.9 6.7 19.5l1.1-6L3.4 9.3l6-.8z" fill={Y} />,
  'star-outline': <path d="M12 3l2.6 5.5 6 .8-4.4 4.2 1.1 6L12 16.9 6.7 19.5l1.1-6L3.4 9.3l6-.8z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" opacity="0.5" />,
  lock: (
    <>
      <rect x="5" y="10" width="14" height="10" rx="2.5" fill="currentColor" opacity="0.85" />
      <path d="M8 10V8a4 4 0 018 0v2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="15" r="1.6" fill={W} />
    </>
  ),
  question: (
    <>
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.15" />
      <path d="M9.3 9.2a2.8 2.8 0 015.4 1c0 1.8-2.4 2-2.4 3.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.1" fill="currentColor" />
    </>
  ),
  mountain: (
    <>
      <path d="M2 20l6.5-12 4 6.5L15 11l7 9z" fill={G} />
      <path d="M6.4 13.2L8.5 8l2.4 4c-1.6.9-3.2 1-4.5 1.2z" fill={W} />
      <path d="M13.6 12.6L15 11l2.2 2.8c-1.2.1-2.4 0-3.6-1.2z" fill={W} />
    </>
  ),
  bamboo: bambooShape(false),
  'bamboo-tall': bambooShape(true),
  gem: (
    <>
      <path d="M6 4h12l3 5-9 11L3 9z" fill={B} />
      <path d="M6 4l2.5 5H3zM18 4l-2.5 5H21zM8.5 9L12 20 15.5 9z" fill="#a9d9ee" />
      <path d="M8.5 9h7L12 20z" fill={B} />
    </>
  ),
  gift: (
    <>
      <rect x="4" y="9" width="16" height="11" rx="1.6" fill={P} />
      <rect x="4" y="9" width="16" height="3.4" fill="#ff9fb6" />
      <rect x="11" y="6" width="2" height="14" fill="#ff7a97" />
      <path d="M12 6C10 3 6 4 8 6.5c1 1.2 3 .5 4-.5zM12 6c2-3 6-2 4 .5-1 1.2-3 .5-4-.5z" fill="#ff7a97" />
    </>
  ),
  crown: (
    <>
      <path d="M3 8l3.5 3L12 5l5.5 6L21 8l-1.5 10h-15z" fill={Y} />
      <rect x="4.5" y="17" width="15" height="2.6" rx="1" fill="#f2c14e" />
      <circle cx="12" cy="10.5" r="1.2" fill={P} />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19C4 11 10 4 19 4c1 8-5 15-14 15z" fill={G} />
      <path d="M7 17C10 12 13 9 18 6" fill="none" stroke={DG} strokeWidth="1.3" strokeLinecap="round" />
    </>
  ),
  clover: (
    <>
      <circle cx="9" cy="9" r="3.6" fill={G} />
      <circle cx="15" cy="9" r="3.6" fill={G} />
      <circle cx="9" cy="14.5" r="3.6" fill={G} />
      <circle cx="15" cy="14.5" r="3.6" fill={G} />
      <path d="M12 12l1 8" stroke={DG} strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  heart: <path d="M12 20S3.5 14.5 3.5 8.8A4.3 4.3 0 0112 6a4.3 4.3 0 018.5 2.8C20.5 14.5 12 20 12 20z" fill={P} />,
  cloud: <path d="M7 18a4 4 0 010-8 5 5 0 019.6-1.3A3.8 3.8 0 0117 18z" fill={B} />,
  rice: (
    <>
      <path d="M12 4c3 0 7 9 6 12H6c-1-3 3-12 6-12z" fill={W} stroke="#e4e4e4" strokeWidth="1" />
      <rect x="8.5" y="13" width="7" height="4.5" rx="1" fill={K} />
    </>
  ),
  egg: <ellipse cx="12" cy="13" rx="7" ry="9" fill={W} stroke="#e8e8e8" strokeWidth="1" />,
  flower: (
    <>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="12" cy="6.5" rx="2.4" ry="3.6" fill={P} transform={`rotate(${a} 12 12)`} />
      ))}
      <circle cx="12" cy="12" r="2.6" fill={Y} />
    </>
  ),
  fish: (
    <>
      <path d="M3 12c3-5 10-5 13 0-3 5-10 5-13 0z" fill={O} />
      <path d="M16 12l5-3v6z" fill={O} />
      <circle cx="7" cy="11" r="1.1" fill={K} />
    </>
  ),
  house: (
    <>
      <path d="M12 4l9 7H3z" fill={O} />
      <rect x="5.5" y="10.5" width="13" height="9.5" fill={Y} />
      <rect x="10" y="14" width="4" height="6" fill={O} />
    </>
  ),
  tree: (
    <>
      <rect x="10.7" y="13" width="2.6" height="7" rx="1" fill="#a9743f" />
      <circle cx="12" cy="9" r="6" fill={G} />
      <circle cx="8" cy="11" r="3.4" fill={DG} />
      <circle cx="16" cy="11" r="3.4" fill={DG} />
    </>
  ),
  cat: (
    <>
      <path d="M5 6l2 4M19 6l-2 4" stroke={GR} strokeWidth="0" />
      <path d="M5 5l3.5 3 7 0L19 5l-1 7a6 6 0 01-12 0z" fill={GR} />
      <circle cx="9.5" cy="12" r="1.2" fill={K} />
      <circle cx="14.5" cy="12" r="1.2" fill={K} />
      <path d="M12 14.5l-1 1M12 14.5l1 1" stroke={K} strokeWidth="1" strokeLinecap="round" />
    </>
  ),
  moon: <path d="M15 3a9 9 0 100 18 7 7 0 010-18z" fill={Y} />,
  cup: (
    <>
      <path d="M5 10h12v4a6 6 0 01-12 0z" fill={W} stroke={K} strokeWidth="1.2" />
      <path d="M17 11h2a2 2 0 010 4h-2" fill="none" stroke={K} strokeWidth="1.2" />
      <path d="M8 7c0-1 1-1 1-2M12 7c0-1 1-1 1-2" stroke={K} strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.5" />
    </>
  ),
  duck: (
    <>
      <circle cx="10" cy="9" r="4" fill={Y} />
      <path d="M6 13c0-1 2-2 5-2s7 1 7 4-3 4-6 4-6-1-6-3z" fill={Y} />
      <path d="M13 9h4l-2 2z" fill={O} />
      <circle cx="9" cy="8.5" r="0.9" fill={K} />
    </>
  ),
  ghost: (
    <>
      <path d="M6 12a6 6 0 0112 0v8l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5z" fill={W} stroke="#e6e6e6" strokeWidth="1" />
      <circle cx="9.5" cy="11" r="1.1" fill={K} />
      <circle cx="14.5" cy="11" r="1.1" fill={K} />
    </>
  ),
  sakura: (
    <>
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} d="M12 4c1.6 0 2.8 1.4 2.8 3S13 12 12 12s-2.8-1.4-2.8-2.9S10.4 4 12 4z" fill={P} transform={`rotate(${a} 12 12)`} />
      ))}
      <circle cx="12" cy="12" r="1.8" fill="#ff7a97" />
    </>
  ),
  confetti: (
    <>
      <rect x="4" y="5" width="2.6" height="2.6" rx="0.6" fill={P} transform="rotate(20 5 6)" />
      <rect x="16" y="4" width="2.6" height="2.6" rx="0.6" fill={B} transform="rotate(-15 17 5)" />
      <rect x="18" y="14" width="2.6" height="2.6" rx="0.6" fill={Y} transform="rotate(25 19 15)" />
      <rect x="4" y="15" width="2.6" height="2.6" rx="0.6" fill={G} transform="rotate(-20 5 16)" />
      <circle cx="12" cy="6" r="1.3" fill={O} />
      <circle cx="11" cy="18" r="1.3" fill="#c780e8" />
    </>
  ),
  panda: pandaFace(false),
  'panda-sleepy': pandaFace(true),
  'panda-hug': (
    <>
      <ellipse cx="5.5" cy="16" rx="2.2" ry="1.6" fill={K} />
      <ellipse cx="18.5" cy="16" rx="2.2" ry="1.6" fill={K} />
      {pandaFace(false)}
    </>
  ),
  koala: (
    <>
      <circle cx="6" cy="8" r="3.6" fill={GR} />
      <circle cx="18" cy="8" r="3.6" fill={GR} />
      <circle cx="6" cy="8" r="2" fill="#d7dbe0" />
      <circle cx="18" cy="8" r="2" fill="#d7dbe0" />
      <circle cx="12" cy="13" r="7" fill={GR} />
      <circle cx="9.3" cy="12" r="1.2" fill={K} />
      <circle cx="14.7" cy="12" r="1.2" fill={K} />
      <ellipse cx="12" cy="15.5" rx="2.2" ry="1.7" fill={K} />
    </>
  ),
  'red-panda': (
    <>
      <path d="M4 6l3 3M20 6l-3 3" stroke={O} strokeWidth="0" />
      <circle cx="6" cy="7" r="3" fill={O} />
      <circle cx="18" cy="7" r="3" fill={O} />
      <circle cx="6" cy="7" r="1.5" fill={W} />
      <circle cx="18" cy="7" r="1.5" fill={W} />
      <circle cx="12" cy="13" r="7.5" fill={O} />
      <path d="M12 8c-3 0-5 2-5 2 2 1 3 1 5 1s3 0 5-1c0 0-2-2-5-2z" fill={W} />
      <ellipse cx="9" cy="13" rx="1.5" ry="2" fill="#7a3b1d" />
      <ellipse cx="15" cy="13" rx="1.5" ry="2" fill="#7a3b1d" />
      <circle cx="9" cy="13" r="0.9" fill={K} />
      <circle cx="15" cy="13" r="0.9" fill={K} />
      <ellipse cx="12" cy="16.5" rx="1.3" ry="1" fill={K} />
    </>
  ),
  'panda-token': (
    <>
      <circle cx="6" cy="6.5" r="3.2" fill={K} />
      <circle cx="18" cy="6.5" r="3.2" fill={K} />
      <circle cx="12" cy="13" r="8.4" fill={W} />
      <ellipse cx="8.4" cy="12" rx="2.1" ry="2.7" fill={K} />
      <ellipse cx="15.6" cy="12" rx="2.1" ry="2.7" fill={K} />
      <circle cx="8.7" cy="12.6" r="0.7" fill={W} />
      <circle cx="15.9" cy="12.6" r="0.7" fill={W} />
      <ellipse cx="12" cy="16.4" rx="1.6" ry="1.2" fill={K} />
    </>
  ),
  'bamboo-token': (
    <>
      <rect x="9.2" y="2.5" width="5.6" height="19" rx="2.6" fill={G} />
      <rect x="9.2" y="8" width="5.6" height="1.7" fill={DG} />
      <rect x="9.2" y="14" width="5.6" height="1.7" fill={DG} />
      <path d="M9.2 6.5q-4.5 0.2 -5.7 -2.8 3.8 -0.8 5.7 2.8z" fill={DG} />
      <path d="M14.8 12.5q4.5 0.2 5.7 -2.8 -3.8 -0.8 -5.7 2.8z" fill={DG} />
    </>
  ),
  'red-panda-token': critter({ face: O, ear: '#c96a34', innerEar: W, muzzle: W, nose: K }),
  'koala-token': critter({ face: S, ear: S, innerEar: '#d7dbe0', nose: K, muzzle: '#cfd4da' }),
  'polar-token': critter({ face: W, ear: W, innerEar: '#e7eef2', muzzle: '#eef4f7', nose: K }),
  'brown-token': critter({ face: N, ear: '#a8703f', muzzle: '#e0b483', nose: K }),
  'polar-bear': critter({ face: W, ear: W, innerEar: '#e7eef2', muzzle: '#eef4f7', nose: K }),
  'brown-bear': critter({ face: N, ear: '#a8703f', muzzle: '#e0b483', nose: K }),
  sun: (
    <>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <rect key={a} x="11" y="1.5" width="2" height="4" rx="1" fill={O} transform={`rotate(${a} 12 12)`} />
      ))}
      <circle cx="12" cy="12" r="6" fill={Y} />
    </>
  ),
  wave: (
    <>
      <path d="M2 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0v11H2z" fill={B} />
      <path d="M2 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0" fill="none" stroke="#5fa8d3" strokeWidth="1.4" />
    </>
  ),
  tiger: tigerFace(),
  'tiger-token': tigerFace(),
  ninja: ninjaFace(),
  'ninja-token': ninjaFace(),
  fireworks: (
    <>
      <circle cx="12" cy="12" r="1.6" fill={Y} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
        <g key={a} transform={`rotate(${a} 12 12)`}>
          <rect x="11.4" y="3" width="1.2" height="5" rx="0.6" fill={[P, B, Y, O, G][i % 5]} />
          <circle cx="12" cy="3" r="1.1" fill={[P, B, Y, O, G][i % 5]} />
        </g>
      ))}
    </>
  ),
  planet: (
    <>
      <circle cx="11" cy="11" r="6.5" fill="#a78bfa" />
      <circle cx="8.6" cy="9" r="1.6" fill="#c4b5fd" />
      <circle cx="13" cy="13" r="1" fill="#8b6ff0" />
      <ellipse cx="11" cy="12" rx="10" ry="3.2" fill="none" stroke="#ffd66b" strokeWidth="1.6" transform="rotate(-20 11 12)" />
    </>
  ),
};

export interface IconProps {
  name: IconName;
  size?: number | string;
  className?: string;
  title?: string;
}

export function Icon({ name, size = '1em', className, title }: IconProps) {
  const dim = typeof size === 'number' ? `${size}px` : size;
  return (
    <span
      className={`icon${className ? ` ${className}` : ''}`}
      style={{ width: dim, height: dim }}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <svg viewBox="0 0 24 24" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        {ICONS[name]}
      </svg>
    </span>
  );
}
