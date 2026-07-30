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

const Frame = styled('iframe')(() => ({
  border: 0,
  width: '100%',
  flex: 1,
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
          <Frame
            src="https://archive.org/embed/the-impossible-quiz_202207"
            allowFullScreen
            title="The Impossible Quiz (Internet Archive)"
          />
        </Surface>
      </Dialog>
    </>
  );
}

export default ImpossibleQuizModal;
