import { JSX } from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Root = styled('footer')(({ theme }) => ({
  position: 'relative',
  bottom: 0,
  left: 0,
  width: '100%',
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
}));

export default function Footer(): JSX.Element {
  return (
    <Root>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography color='textPrimary'>&copy; wattry {new Date().getFullYear()}</Typography>
      </div>
    </Root>
  );
}
