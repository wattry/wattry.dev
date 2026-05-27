import { Button, ButtonProps, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import CookieConsent from 'react-cookie-consent';

type AcceptButtonProps = ButtonProps & { extraStyle?: React.CSSProperties };

const StyledAcceptButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'extraStyle',
})<AcceptButtonProps>(({ theme, extraStyle }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: theme.palette.text.primary,
  marginTop: '1rem',
  marginRight: '2rem',
  ...extraStyle,
}));

const AcceptButton = (props: any) => {
  const { id, children, onClick, style } = props;

  return (
    <StyledAcceptButton
      variant='outlined'
      size='large'
      onClick={onClick}
      extraStyle={{ ...style, id }}>
      {children}
    </StyledAcceptButton>
  );
};

export default function CookiePolicy(props: any) {
  const { setConsented }: { setConsented: (consented: boolean) => void } = props;

  return (
    <CookieConsent
      {...props}
      buttonId='accept'
      location='bottom'
      buttonText='Accept'
      cookieName='consented'
      onAccept={() => setConsented(true)}
      enableDeclineButton
      declineButtonText='Decline'
      setDeclineCookie={false}
      declineButtonId='decline'
      flipButtons
      overlay
      overlayStyle={{
        backgroundColor: 'rgba(0,0,0,0.7)',
      }}
      sameSite='strict'
      ButtonComponent={AcceptButton}
      expires={365}>
      This website requires cookies to enhance the user experience and secure data requests. Cookies
      are only set if you consent login using LinkedIn and are deleted on logout. We do not store
      any data in browser until you consent.
      <ul>
        <li>
          <Link
            color='textSecondary'
            href='https://www.privacypolicies.com/live/fd63755a-6d7d-47ed-abc0-39b8929b6ecf'
            target='#'>
            Cookie Policy
          </Link>
        </li>
        <li>
          <Link
            color='textSecondary'
            target='#'
            href='https://www.privacypolicies.com/live/f9b3ac4f-ad26-4312-8263-f0e238124610'>
            Privacy Policy
          </Link>
        </li>
      </ul>
    </CookieConsent>
  );
}
