import { Typography, Link } from '@mui/material';
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
        <Typography color='textPrimary'>&copy; wattry</Typography>
        <Link
          style={{ marginLeft: '5rem' }}
          color='textPrimary'
          target='#'
          href='https://www.privacypolicies.com/live/f9b3ac4f-ad26-4312-8263-f0e238124610'>
          Privacy Policy
        </Link>
      </div>
    </Root>
  );
}
