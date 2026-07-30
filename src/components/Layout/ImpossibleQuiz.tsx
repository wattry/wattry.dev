import { useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useCaptureKeydown } from '../../hooks/useCaptureKeydown';

export interface QuizResult {
  won: boolean;
  attempts: number;
  reached: number;
}

interface ImpossibleQuizProps {
  onDone: (result: QuizResult) => void;
}

interface Question {
  prompt: string;
  options: [string, string, string, string];
  answer: number;
}

const WRONG_FLASH_MS = 900;

const Wrong = styled('pre')(({ theme }) => ({
  margin: 0,
  color: theme.palette.error.main,
}));

const Banner = styled('pre')(({ theme }) => ({
  margin: 0,
  color: theme.palette.success.main,
}));

const QUESTIONS: Question[] = [
  {
    prompt: 'What colour is this terminal?',
    options: ['White', 'Green', '#00FD61', 'Depends on the theme'],
    answer: 3,
  },
  {
    prompt: 'Ma might...',
    options: ['Urgh!', 'Ma definitely will', '...but Pa might not', 'Toast is ready'],
    answer: 2,
  },
  {
    prompt: 'sudo make me a sandwich',
    options: ['Okay', 'You are not in the sudoers file', '404', 'rm -rf /kitchen'],
    answer: 1,
  },
  {
    prompt: 'Complete the sequence: 1, 2, 3, ...',
    options: ['4', '5', 'Fish', 'Profit'],
    answer: 2,
  },
  {
    prompt: 'Which key do you press to continue?',
    options: ['Any key', 'The Florida Keys', 'F', 'This one'],
    answer: 3,
  },
  {
    prompt: 'What does TCP stand for?',
    options: [
      'Transmission Control Protocol',
      'That Cat Purrs',
      'Totally Correct, Probably',
      'Trick question — it stands for nothing',
    ],
    answer: 0,
  },
  {
    prompt: 'In snake, what rank sits above Senior Developer?',
    options: ['Staff Snake', 'Professional Manager', '10x Snake', 'CTO'],
    answer: 1,
  },
  {
    prompt: 'How do you exit vim?',
    options: [':q!', 'Ctrl+C harder', "You don't", 'Unplug the computer'],
    answer: 2,
  },
  {
    prompt: 'Jonah Lomu vs Mike Catt — who wins?',
    options: ['Mike Catt', 'Physics', 'Jonah Lomu', 'Both B and C'],
    answer: 3,
  },
  {
    prompt: 'Was this quiz impossible?',
    options: ['Yes', 'No', 'I restarted 14 times', 'All of the above'],
    answer: 3,
  },
];

const LETTERS = ['A', 'B', 'C', 'D'] as const;

const WIN_BANNER = [
  ' ╔══════════════════════════════════╗',
  ' ║   YOU BEAT THE IMPOSSIBLE QUIZ   ║',
  ' ║   (terminal homage edition)      ║',
  ' ╚══════════════════════════════════╝',
].join('\n');

function ImpossibleQuiz({ onDone }: ImpossibleQuizProps) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'ask' | 'wrong' | 'won'>('ask');
  const attemptsRef = useRef(1);
  const bestRef = useRef(0);
  const doneRef = useRef(false);

  useCaptureKeydown((event) => {
    if (doneRef.current || phase === 'wrong') {
      return;
    }

    if (phase === 'won') {
      doneRef.current = true;
      onDone({ won: true, attempts: attemptsRef.current, reached: QUESTIONS.length });
      return;
    }

    if (event.key === 'Escape') {
      doneRef.current = true;
      onDone({ won: false, attempts: attemptsRef.current, reached: bestRef.current + 1 });
      return;
    }

    const choice = LETTERS.indexOf(event.key.toUpperCase() as typeof LETTERS[number]);

    if (choice === -1) {
      return;
    }

    const question = QUESTIONS[index];

    if (!question) {
      return;
    }

    if (choice !== question.answer) {
      attemptsRef.current += 1;
      setPhase('wrong');
      setTimeout(() => {
        setIndex(0);
        setPhase('ask');
      }, WRONG_FLASH_MS);
      return;
    }

    bestRef.current = Math.max(bestRef.current, index);

    if (index + 1 === QUESTIONS.length) {
      setPhase('won');
      return;
    }

    setIndex(index + 1);
  });

  if (phase === 'won') {
    return (
      <>
        <Banner>{WIN_BANNER}</Banner>
        <Typography>attempt {attemptsRef.current} — any key to bask</Typography>
      </>
    );
  }

  if (phase === 'wrong') {
    return <Wrong>{'\n  WRONG.\n  Back to question 1.\n'}</Wrong>;
  }

  const question = QUESTIONS[index];

  if (!question) {
    return <Typography color="error">quiz broke. impressive.</Typography>;
  }

  return (
    <>
      <Typography>
        QUESTION {index + 1}/{QUESTIONS.length} — attempt {attemptsRef.current}
      </Typography>
      <Typography>{question.prompt}</Typography>
      <Typography>
        {question.options.map((option, i) => (
          <li key={`${index}-${i}`} style={{ listStyle: 'none' }}>
            {LETTERS[i]}) {option}
          </li>
        ))}
      </Typography>
      <Typography color="textSecondary">[A-D] answer — Esc rage quit</Typography>
    </>
  );
}

export default ImpossibleQuiz;
