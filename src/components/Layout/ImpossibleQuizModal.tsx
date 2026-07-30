import { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// Logical size the archive.org player is rendered at before scaling; the
// game canvas inside it is fixed-size, so we scale the whole page up.
const BASE_W = 860;
const BASE_H = 660;

const Surface = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: '#000',
}));

const Bar = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  backgroundColor: '#131519',
}));

const Stage = styled('div')(() => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
}));

const Frame = styled('iframe')(() => ({
  border: 0,
  width: BASE_W,
  height: BASE_H,
  flexShrink: 0,
}));

function ImpossibleQuizModal() {
  const [open, setOpen] = useState(true);
  const [scale, setScale] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    const update = () => {
      const rect = stage.getBoundingClientRect();

      setScale(Math.max(0.5, Math.min(rect.width / BASE_W, rect.height / BASE_H)));
    };

    update();

    const observer = new ResizeObserver(update);

    observer.observe(stage);

    return () => observer.disconnect();
  }, [open]);

  if (!open) {
    return <Typography>quiz: session ended. the quiz remains undefeated.</Typography>;
  }

  return (
    <>
      <Typography>quiz: opening The Impossible Quiz — Esc or ✕ ends the game.</Typography>
      <Dialog fullScreen open={open} onClose={() => setOpen(false)}>
        <Surface>
          <Bar>
            <Typography>The Impossible Quiz — Splapp-me-do, 2007 — served by archive.org (Ruffle emulation)</Typography>
            <Button color="error" variant="outlined" onClick={() => setOpen(false)}>✕ close</Button>
          </Bar>
          <Stage ref={stageRef}>
            <Frame
              src="https://archive.org/embed/the-impossible-quiz_202207"
              allowFullScreen
              title="The Impossible Quiz (Internet Archive)"
              style={{ transform: `scale(${scale})` }}
            />
          </Stage>
        </Surface>
      </Dialog>
    </>
  );
}

export default ImpossibleQuizModal;
