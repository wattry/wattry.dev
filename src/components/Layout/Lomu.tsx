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
const FRAME_MS = 80;
const END_CARD_MS = 2500;

const END_CARD = [
  '',
  '  ╔══════════════════════════════════════╗',
  '  ║                 TRY!!                ║',
  '  ║   Jonah Lomu — RWC 1995 semi-final   ║',
  '  ║   Mike Catt: run over, no refunds    ║',
  '  ║   NZL 45 - 29 ENG — four tries       ║',
  '  ╚══════════════════════════════════════╝',
].join('\n');

const place = (line: string, x: number, text: string): string => {
  if (x < 0 || x >= line.length) {
    return line;
  }

  return (line.slice(0, x) + text + line.slice(x + text.length)).slice(0, FIELD);
};

const buildFrame = (runnerX: number): string => {
  const blank = ' '.repeat(FIELD);
  let row0 = blank;
  let row1 = blank;
  let row2 = blank;
  let row3 = blank;
  let ground = '─'.repeat(FIELD);

  row1 = place(row1, TRY_X, '|');
  row2 = place(row2, TRY_X, '|');
  row3 = place(row3, TRY_X, '|');

  const flattened = runnerX > DEFENDER_X;

  if (flattened) {
    ground = place(ground, DEFENDER_X - 1, '_x_');
  } else {
    row1 = place(row1, DEFENDER_X, 'O');
    row2 = place(row2, DEFENDER_X - 1, '/|\\');
    row3 = place(row3, DEFENDER_X - 1, '/ \\');
  }

  if (Math.abs(runnerX - DEFENDER_X) <= 2) {
    row0 = place(row0, DEFENDER_X - 3, '*BAM!*');
  }

  row1 = place(row1, runnerX + 1, 'O');
  row2 = place(row2, runnerX, '/|\\o');
  row3 = place(row3, runnerX, '/ \\');

  return [row0, row1, row2, row3, ground].join('\n');
};

function Lomu({ onDone }: LomuProps) {
  const [frame, setFrame] = useState(() => buildFrame(0));
  const doneRef = useRef(false);

  useCaptureKeydown(() => {});

  useEffect(() => {
    const runner = { x: 0 };
    let endTimer: ReturnType<typeof setTimeout> | undefined;
    const timer = setInterval(() => {
      runner.x += 1;

      if (runner.x >= TRY_X - 3) {
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

      setFrame(buildFrame(runner.x));
    }, FRAME_MS);

    return () => {
      clearInterval(timer);

      if (endTimer !== undefined) {
        clearTimeout(endTimer);
      }

      if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
    };
  }, [onDone]);

  return <Pitch>{frame}</Pitch>;
}

export default Lomu;
