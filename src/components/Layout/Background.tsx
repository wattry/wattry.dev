import { useState } from 'react';
import { styled } from '@mui/material/styles';

import space from '../../static/space.mp4';

const Video = styled('video')<{ loaded: boolean }>(({ loaded }) => {
  return ({
    objectFit: 'cover',
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: -1,
    opacity: loaded ? 1 : 0,
    transition: 'opacity 1s ease-in',
  });
});

export default function Background(props: any) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div {...props}>
      <Video
        autoPlay
        loop
        muted
        loaded={loaded}
        onCanPlay={() => setLoaded(true)}
      >
        <source src={space} type='video/mp4' />
      </Video>
    </div>
  );
}
