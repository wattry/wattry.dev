import { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useCaptureKeydown } from '../../hooks/useCaptureKeydown';

interface SnakeProps {
  onQuit: (score: number) => void;
}

interface Point {
  x: number;
  y: number;
}

type Direction = 'up' | 'down' | 'left' | 'right';

const COLS = 24;
const ROWS = 16;
const TICK_MS = 120;

const Board = styled('pre')(({ theme }) => ({
  margin: 0,
  lineHeight: 1.05,
  letterSpacing: '2px',
  color: theme.palette.success.main,
}));

const GameOver = styled('pre')(({ theme }) => ({
  margin: 0,
  lineHeight: 1.2,
  color: theme.palette.error.main,
}));

// Auto-repeat from the key held at the moment of collision fires within
// ~30ms; without a grace period it dismisses the game-over screen unseen.
const GAME_OVER_GRACE_MS = 600;

export const snakeRank = (score: number): string => {
  if (score < 100) {
    return 'Junior developer';
  }
  if (score < 200) {
    return 'Middle Level Dev';
  }
  if (score < 300) {
    return 'Senior Developer';
  }

  return 'Professional Manager';
};

const randomFood = (occupied: Point[]): Point => {
  while (true) {
    const food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };

    if (!occupied.some((p) => p.x === food.x && p.y === food.y)) {
      return food;
    }
  }
};

function Snake({ onQuit }: SnakeProps) {
  const snakeRef = useRef<Point[]>([{ x: 12, y: 8 }, { x: 11, y: 8 }, { x: 10, y: 8 }]);
  const directionRef = useRef<Direction>('right');
  const nextDirectionRef = useRef<Direction>('right');
  const foodRef = useRef<Point>({ x: 18, y: 8 });
  const scoreRef = useRef(0);
  const overRef = useRef(false);
  const overAtRef = useRef(0);
  const doneRef = useRef(false);
  const [, setTick] = useState(0);

  useCaptureKeydown((event) => {
    if (doneRef.current) {
      return;
    }

    if (overRef.current) {
      if (performance.now() - overAtRef.current < GAME_OVER_GRACE_MS) {
        return;
      }

      doneRef.current = true;
      onQuit(scoreRef.current);
      return;
    }

    if (event.key === 'Escape') {
      doneRef.current = true;
      onQuit(scoreRef.current);
      return;
    }

    const direction = directionRef.current;

    if ((event.key === 'ArrowUp' || event.key === 'w') && direction !== 'down') {
      nextDirectionRef.current = 'up';
    }
    if ((event.key === 'ArrowDown' || event.key === 's') && direction !== 'up') {
      nextDirectionRef.current = 'down';
    }
    if ((event.key === 'ArrowLeft' || event.key === 'a') && direction !== 'right') {
      nextDirectionRef.current = 'left';
    }
    if ((event.key === 'ArrowRight' || event.key === 'd') && direction !== 'left') {
      nextDirectionRef.current = 'right';
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      if (overRef.current || doneRef.current) {
        return;
      }

      directionRef.current = nextDirectionRef.current;
      const [head] = snakeRef.current;

      if (!head) {
        return;
      }

      const moves: Record<Direction, Point> = {
        up: { x: head.x, y: head.y - 1 },
        down: { x: head.x, y: head.y + 1 },
        left: { x: head.x - 1, y: head.y },
        right: { x: head.x + 1, y: head.y },
      };
      const next = moves[directionRef.current];
      const hitWall = next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS;
      const hitSelf = snakeRef.current.some((p) => p.x === next.x && p.y === next.y);

      if (hitWall || hitSelf) {
        overRef.current = true;
        overAtRef.current = performance.now();
        setTick((prev) => prev + 1);
        return;
      }

      const ate = next.x === foodRef.current.x && next.y === foodRef.current.y;

      snakeRef.current = ate
        ? [next, ...snakeRef.current]
        : [next, ...snakeRef.current.slice(0, -1)];

      if (ate) {
        scoreRef.current += 10;
        foodRef.current = randomFood(snakeRef.current);
      }

      setTick((prev) => prev + 1);
    }, TICK_MS);

    return () => clearInterval(timer);
  }, []);

  const rows: string[] = [];

  for (let y = 0; y < ROWS; y += 1) {
    let row = '';

    for (let x = 0; x < COLS; x += 1) {
      const isSnake = snakeRef.current.some((p) => p.x === x && p.y === y);
      const isFood = foodRef.current.x === x && foodRef.current.y === y;

      row += isSnake ? '█' : isFood ? '◆' : '·';
    }

    rows.push(row);
  }

  const banner = [
    '╔═══════════════════════════════╗',
    '║           GAME OVER           ║',
    `║  score:  ${String(scoreRef.current).padEnd(20)} ║`,
    `║  length: ${String(snakeRef.current.length).padEnd(20)} ║`,
    `║  rank:   ${snakeRank(scoreRef.current).padEnd(20)} ║`,
    '╚═══════════════════════════════╝',
    '        any key to exit',
  ].join('\n');

  return (
    <>
      <Typography>
        score: {scoreRef.current} — arrows/WASD steer, Esc quits
      </Typography>
      {overRef.current && <GameOver>{banner}</GameOver>}
      <Board>{rows.join('\n')}</Board>
    </>
  );
}

export default Snake;
