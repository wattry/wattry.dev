import { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';

import { useCaptureKeydown } from '../../hooks/useCaptureKeydown';

interface LomuProps {
  onDone: () => void;
}

const Pitch = styled('pre')(({ theme }) => ({
  margin: 0,
  whiteSpace: 'pre',
  color: theme.palette.text.primary,
}));

const FIELD = 60;
const DEFENDER_X = 40;
const TRY_X = 56;
const IMPACT_X = DEFENDER_X - 6;
const FRAME_MS = 90;
const STRIDE_EVERY = 3;
const END_CARD_MS = 3000;

const LOMU_A = [
  '  ___   ',
  ' (o,o)  ',
  ' /███\\-o',
  ' |███|  ',
  ' _/ \\_  ',
];

const LOMU_B = [
  '  ___   ',
  ' (o,o)  ',
  ' /███\\-o',
  ' |███|  ',
  '  / \\   ',
];

const LOMU_FEND = [
  '  ___   ',
  ' (o,o)  ',
  ' /███\\==',
  ' |███|-o',
  ' _/ \\_  ',
];

const CATT = [
  '  o  ',
  ' /|\\ ',
  '  |  ',
  ' / \\ ',
];

const CATT_UP = [
  ' \\o/ ',
  '  |  ',
];

const CATT_DOWN = [
  ' _o\\ ',
];

const END_CARD = [
  '',
  ' ╔══════════════════════════════════════════╗',
  ' ║   T   R   Y   ! ! !                      ║',
  ' ║                                          ║',
  ' ║   Jonah Lomu — 1995 RWC semi-final       ║',
  ' ║   Newlands, Cape Town                    ║',
  ' ║   Mike Catt: became a speed bump         ║',
  ' ║   NZL 45 - 29 ENG — four Lomu tries      ║',
  ' ╚══════════════════════════════════════════╝',
].join('\n');

// Writes text onto a row, treating spaces in the art as transparent so
// figures can overlap the try line and each other without erasing them.
const stamp = (line: string, x: number, text: string): string => {
  const chars = line.split('');

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const pos = x + i;

    if (char !== undefined && char !== ' ' && pos >= 0 && pos < FIELD) {
      chars[pos] = char;
    }
  }

  return chars.join('');
};

const buildFrame = (runnerX: number, stride: boolean): string => {
  const rows: string[] = Array.from({ length: 6 }, () => ' '.repeat(FIELD));
  let ground = '─'.repeat(FIELD);
  const sinceImpact = runnerX - IMPACT_X;

  for (let r = 1; r <= 5; r += 1) {
    rows[r] = stamp(rows[r] ?? '', TRY_X, '│');
  }

  const commentary = sinceImpact < 0
    ? 'Lomu... Lomu with the ball...'
    : sinceImpact < 6
      ? 'OH! OH!'
      : '...he simply ran straight over him!';

  rows[0] = stamp(rows[0] ?? '', 1, commentary);

  if (sinceImpact < 0) {
    CATT.forEach((line, i) => {
      rows[i + 2] = stamp(rows[i + 2] ?? '', DEFENDER_X - 2, line);
    });
  } else if (sinceImpact < 3) {
    CATT_UP.forEach((line, i) => {
      rows[i + 1] = stamp(rows[i + 1] ?? '', DEFENDER_X - 1, line);
    });
  } else if (sinceImpact < 6) {
    CATT_DOWN.forEach((line, i) => {
      rows[i + 4] = stamp(rows[i + 4] ?? '', DEFENDER_X, line);
    });
  } else {
    ground = stamp(ground, DEFENDER_X - 2, '__x__');
  }

  if (sinceImpact >= 0 && sinceImpact < 4) {
    rows[0] = stamp(rows[0] ?? '', DEFENDER_X - 3, '*BAM!*');
  }

  const art = sinceImpact >= 0 && sinceImpact < 4
    ? LOMU_FEND
    : stride ? LOMU_A : LOMU_B;

  art.forEach((line, i) => {
    rows[i + 1] = stamp(rows[i + 1] ?? '', runnerX, line);
  });

  return [...rows, ground].join('\n');
};

function Lomu({ onDone }: LomuProps) {
  const [frame, setFrame] = useState(() => buildFrame(0, true));
  const doneRef = useRef(false);

  useCaptureKeydown(() => {});

  useEffect(() => {
    const runner = { x: 0, tick: 0 };
    let endTimer: ReturnType<typeof setTimeout> | undefined;
    const timer = setInterval(() => {
      runner.x += 1;
      runner.tick += 1;

      if (runner.x >= TRY_X - 6) {
        clearInterval(timer);
        setFrame(END_CARD);
        endTimer = setTimeout(() => {
          if (!doneRef.current) {
            doneRef.current = true;
            onDone();
          }
        }, END_CARD_MS);
        return;
      }

      const stride = Math.floor(runner.tick / STRIDE_EVERY) % 2 === 0;

      setFrame(buildFrame(runner.x, stride));
    }, FRAME_MS);

    // No onDone here: StrictMode dev double-mount runs this cleanup
    // immediately after first mount, which would resolve the command's
    // promise before the animation renders a single frame.
    return () => {
      clearInterval(timer);

      if (endTimer !== undefined) {
        clearTimeout(endTimer);
      }
    };
  }, [onDone]);

  return <Pitch>{frame}</Pitch>;
}

export default Lomu;
