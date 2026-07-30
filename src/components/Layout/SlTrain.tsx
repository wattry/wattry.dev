import { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';

interface SlTrainProps {
  onDone: () => void;
}

const Frame = styled('pre')(({ theme }) => ({
  margin: 0,
  overflow: 'hidden',
  whiteSpace: 'pre',
  color: theme.palette.text.primary,
}));

const TRAIN = [
  '      ====        ________                ___________',
  '  _D _|  |_______/        \\__I_I_____===__|_________|',
  '   |(_)---  |   H\\________/ |   |        =|___ ___|  ',
  '   /     |  |   H  |  |     |   |         ||_| |_||  ',
  '  |      |  |   H  |__--------------------| [___] |  ',
  '  | ________|___H__/__|_____/[][]~\\_______|       |  ',
  '  |/ |   |-----------I_____I [][] []  D   |=======|__',
  '__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__',
  ' |/-=|___|=    ||    ||    ||    |_____/~\\___/       ',
  '  \\_/      \\O=====O=====O=====O_/      \\_/           ',
];

const COLS = 90;
const FRAME_MS = 80;

function SlTrain({ onDone }: SlTrainProps) {
  const [offset, setOffset] = useState(COLS);
  const doneRef = useRef(false);

  useEffect(() => {
    const trainWidth = TRAIN[0]?.length ?? 0;
    const offsetRef = { current: COLS };
    const timer = setInterval(() => {
      offsetRef.current -= 1;

      if (offsetRef.current < -trainWidth) {
        if (!doneRef.current) {
          doneRef.current = true;
          clearInterval(timer);
          onDone();
        }

        return;
      }

      setOffset(offsetRef.current);
    }, FRAME_MS);

    return () => clearInterval(timer);
  }, [onDone]);

  const rows = TRAIN.map((row) => {
    if (offset >= 0) {
      return (' '.repeat(offset) + row).slice(0, COLS);
    }

    return row.slice(-offset, -offset + COLS);
  });

  return <Frame>{rows.join('\n')}</Frame>;
}

export default SlTrain;
