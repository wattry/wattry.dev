import { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useCaptureKeydown } from '../../hooks/useCaptureKeydown';

interface MatrixRainProps {
  onExit: () => void;
}

const COLS = 60;
const ROWS = 18;
const TICK_MS = 100;
const TAIL = 6;
const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFZ$+-*/=<>';

const Screen = styled('pre')(() => ({
  margin: 0,
  whiteSpace: 'pre',
  color: '#00FD61',
  textShadow: '0 0 6px #00FD61',
  lineHeight: 1.1,
}));

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? '0';

function MatrixRain({ onExit }: MatrixRainProps) {
  const doneRef = useRef(false);
  const dropsRef = useRef<number[]>(Array.from({ length: COLS }, () => Math.floor(Math.random() * ROWS)));
  const gridRef = useRef<string[][]>(
    Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ' '))
  );
  const [, setTick] = useState(0);

  useCaptureKeydown(() => {
    if (!doneRef.current) {
      doneRef.current = true;
      onExit();
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const grid = gridRef.current;
      const drops = dropsRef.current;

      for (let col = 0; col < COLS; col += 1) {
        const row = drops[col] ?? 0;
        const line = grid[row];

        if (line) {
          line[col] = randomGlyph();
        }

        const fade = grid[(row + ROWS - TAIL) % ROWS];

        if (fade) {
          fade[col] = ' ';
        }

        drops[col] = (row + 1) % ROWS;

        if (Math.random() < 0.02) {
          drops[col] = 0;
        }
      }

      setTick((prev) => prev + 1);
    }, TICK_MS);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Screen>{gridRef.current.map((row) => row.join('')).join('\n')}</Screen>
      <Typography>any key to exit</Typography>
    </>
  );
}

export default MatrixRain;
