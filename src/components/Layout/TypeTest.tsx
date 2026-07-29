import { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import type { Snippet } from '../../static/snippets';

export interface TypeTestResult {
  wpm: number;
  accuracy: number;
  snippetId: string;
}

interface TypeTestProps {
  snippet: Snippet;
  onDone: (result: TypeTestResult) => void;
  onAbort: () => void;
}

const Code = styled('div')(({ theme }) => ({
  whiteSpace: 'pre-wrap',
  fontFamily: 'monospace',
  fontSize: '1rem',
  margin: theme.spacing(1, 0),
}));

const Untyped = styled('span')(({ theme }) => ({
  color: theme.palette.text.disabled,
}));

const Correct = styled('span')(({ theme }) => ({
  color: theme.palette.success.main,
}));

const Wrong = styled('span')(({ theme }) => ({
  color: theme.palette.error.main,
  textDecoration: 'underline',
}));

const Cursor = styled('span')(({ theme }) => ({
  color: theme.palette.text.disabled,
  borderBottom: `2px solid ${theme.palette.warning.main}`,
}));

function TypeTest({ snippet, onDone, onAbort }: TypeTestProps) {
  const [typed, setTyped] = useState('');
  const typedRef = useRef('');
  const startRef = useRef<number | null>(null);
  const keystrokesRef = useRef(0);
  const errorsRef = useRef(0);
  const doneRef = useRef(false);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (doneRef.current) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      if (event.key === 'Escape') {
        doneRef.current = true;
        onAbort();
        return;
      }

      if (event.key === 'Backspace') {
        typedRef.current = typedRef.current.slice(0, -1);
        setTyped(typedRef.current);
        return;
      }

      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      const char = event.key === 'Enter' ? '\n' : event.key;

      if (char.length !== 1) {
        return;
      }

      if (startRef.current === null) {
        startRef.current = performance.now();
      }

      keystrokesRef.current += 1;

      const next = typedRef.current + char;
      const expected = snippet.code[next.length - 1];

      if (char !== expected) {
        errorsRef.current += 1;
      }

      typedRef.current = next;
      setTyped(next);

      if (next.length === snippet.code.length) {
        doneRef.current = true;

        const minutes = (performance.now() - (startRef.current ?? performance.now())) / 60000;
        const wpm = Math.round((snippet.code.length / 5) / minutes);
        const accuracy = Math.round(((keystrokesRef.current - errorsRef.current) / keystrokesRef.current) * 1000) / 10;

        onDone({ wpm, accuracy, snippetId: snippet.id });
      }
    };

    document.addEventListener('keydown', handler, { capture: true });

    return () => document.removeEventListener('keydown', handler, { capture: true });
  }, [snippet, onDone, onAbort]);

  return (
    <>
      <Typography>Type the {snippet.lang} snippet below. Timer starts on your first keystroke. Esc aborts.</Typography>
      <Code>
        {snippet.code.split('').map((char, index) => {
          if (index === typed.length) {
            return <Cursor key={index}>{char}</Cursor>;
          }

          if (index > typed.length) {
            return <Untyped key={index}>{char}</Untyped>;
          }

          return typed[index] === char
            ? <Correct key={index}>{char}</Correct>
            : <Wrong key={index}>{char === '\n' ? '⏎\n' : char}</Wrong>;
        })}
      </Code>
    </>
  );
}

export default TypeTest;
