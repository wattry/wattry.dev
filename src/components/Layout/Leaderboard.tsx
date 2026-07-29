import { useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';

import type { TypeTestResult } from './TypeTest';

export interface ScoreRow {
  initials: string;
  wpm: number;
  accuracy: number;
  created_at: string;
}

interface LeaderboardProps {
  result?: TypeTestResult;
}

type Phase = 'loading' | 'entry' | 'submitting' | 'board' | 'error';

const API = import.meta.env.VITE_CF_ENDPOINT;

async function fetchBoard(): Promise<ScoreRow[]> {
  const res = await fetch(new URL('/typetest/board', API));

  if (!res.ok) {
    throw new Error(`board fetch failed: ${res.status}`);
  }

  const json = await res.json();

  return json.scores as ScoreRow[];
}

function Leaderboard({ result }: LeaderboardProps) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [rows, setRows] = useState<ScoreRow[]>([]);
  const [initials, setInitials] = useState('');
  const initialsRef = useRef('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    fetchBoard()
      .then((scores) => {
        if (cancelled) {
          return;
        }

        setRows(scores);

        const worst = scores[scores.length - 1];
        const qualifies = !!result && (scores.length < 20 || result.wpm > (worst?.wpm ?? 0));

        setPhase(qualifies ? 'entry' : 'board');
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setMessage('leaderboard unreachable');
        setPhase('error');
      });

    return () => {
      cancelled = true;
    };
  }, [result]);

  useEffect(() => {
    if (phase !== 'entry') {
      return;
    }

    const submit = async () => {
      if (!result) {
        return;
      }

      setPhase('submitting');

      try {
        const res = await fetch(new URL('/typetest/score', API), {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            initials: initialsRef.current,
            wpm: result.wpm,
            accuracy: result.accuracy,
            snippetId: result.snippetId,
          }),
        });

        if (!res.ok) {
          const json = await res.json().catch(() => ({ error: `submit failed: ${res.status}` }));

          throw new Error(json.error ?? `submit failed: ${res.status}`);
        }

        setRows(await fetchBoard());
        setMessage('score submitted');
      } catch (e: unknown) {
        setMessage((e as Error).message);
      }

      setPhase('board');
    };

    const handler = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.key === 'Escape') {
        setPhase('board');
        return;
      }

      if (event.key === 'Backspace') {
        initialsRef.current = initialsRef.current.slice(0, -1);
        setInitials(initialsRef.current);
        return;
      }

      if (event.key === 'Enter' && initialsRef.current.length === 3) {
        void submit();
        return;
      }

      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      if (/^[a-zA-Z]$/.test(event.key) && initialsRef.current.length < 3) {
        initialsRef.current += event.key.toUpperCase();
        setInitials(initialsRef.current);
      }
    };

    document.addEventListener('keydown', handler, { capture: true });

    return () => document.removeEventListener('keydown', handler, { capture: true });
  }, [phase, result]);

  return (
    <>
      {result && <Typography>WPM: {result.wpm} — Accuracy: {result.accuracy}%</Typography>}
      {phase === 'loading' && <Typography>loading leaderboard…</Typography>}
      {phase === 'entry' && (
        <Typography>
          Top 20! Enter your initials (A–Z, Enter submits, Esc skips): <strong>{initials.padEnd(3, '_')}</strong>
        </Typography>
      )}
      {phase === 'submitting' && <Typography>submitting…</Typography>}
      {message && (
        <Typography color={message === 'score submitted' ? 'success' : 'error'}>{message}</Typography>
      )}
      {(phase === 'board' || phase === 'error') && rows.length > 0 && (
        <Typography component="ol">
          {rows.map((row, index) => (
            <li key={index}>
              {row.initials} — {row.wpm} WPM — {row.accuracy}% — {row.created_at.slice(0, 10)}
            </li>
          ))}
        </Typography>
      )}
      {phase === 'board' && rows.length === 0 && <Typography>No scores yet — be the first.</Typography>}
    </>
  );
}

export default Leaderboard;
