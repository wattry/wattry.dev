import { styled } from '@mui/material/styles';

import space from '../../static/space.mp4';

const Video = styled('video')({
  objectFit: 'cover',
  width: '100vw',
  height: '100vh',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: -1,
});

export default function Background(props: any) {
  return (
    <div {...props}>
      <Video autoPlay loop muted>
        <source src={space} type='video/mp4' />
      </Video>
    </div>
  );
}
