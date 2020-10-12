import React, { Fragment } from 'react';
import { Typography } from '@material-ui/core';
import { Element } from 'react-scroll';

import { Menu } from '../../interfaces/menu.interface';

export default function Section({ icon, title, content, component }: Menu) {
  return (
    <Element key={title} name={title} >
      <Typography variant='h3' component='h2'>
        {icon}
        {title}
      </Typography>
      {component && content ? component(content) : null}
    </Element>
  );
}
