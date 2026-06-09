import { JSX } from 'react';
import { Zoom, useScrollTrigger, Fab } from '@mui/material';
import { KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const MainBox = styled('div')(({ theme }) => ({
  position: 'relative',
  background: 'rgba(0, 0, 0, 0.5)',
  paddingLeft: theme.spacing(2),
  display: 'flex',
}));

const BackToTop = styled('div')(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));

function ScrollTop(props: { children: any }) {
  const { children } = props;

  const trigger = useScrollTrigger({
    target: window,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = ((event.target as HTMLDivElement).ownerDocument || document).querySelector(
      '#top-anchor',
    );

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <BackToTop onClick={handleClick} role='presentation' style={{ zIndex: 10000 }}>
        {children}
      </BackToTop>
    </Zoom>
  );
}

export default function Main(props: any): JSX.Element {
  return (
    <main>
      <MainBox>
        <ScrollTop {...props}>
          <Fab color='default' size='large' aria-label='scroll back to top'>
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </MainBox>
    </main>
  );
}
