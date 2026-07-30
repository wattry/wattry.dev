import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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
  minHeight: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
}));

// The archive.org player renders the game at a fixed size, left-anchored
// but vertically centred, inside its cross-origin frame — we can't scale
// the game itself. Constraining the iframe width to hug that render and
// centring it keeps the game in the middle instead of stranded in a
// corner of the fullscreen void.
const Frame = styled('iframe')(() => ({
  border: 0,
  height: '100%',
  width: 'min(96vw, 680px)',
  flex: '0 0 auto',
}));

function ImpossibleQuizModal() {
  const [open, setOpen] = useState(true);

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
          <Stage>
            <Frame
              src="https://archive.org/embed/the-impossible-quiz_202207"
              allowFullScreen
              title="The Impossible Quiz (Internet Archive)"
            />
          </Stage>
        </Surface>
      </Dialog>
    </>
  );
}

export default ImpossibleQuizModal;
