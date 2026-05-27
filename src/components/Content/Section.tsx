import { Typography } from '@mui/material';
import { Element } from 'react-scroll';

import { Menu } from '../../interfaces/menu.interface';

export default function Section({ icon, title, content, component }: Menu) {
  return (
    <Element key={title} name={title} >
      <Typography variant='h4' component='h2'>
        {icon}
        {title}
      </Typography>
      {component && content ? component(content) : null}
    </Element>
  );
}
