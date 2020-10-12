import React, { Fragment } from 'react';
import { Typography } from '@material-ui/core';
import { Menu } from '../../interfaces/menu.interface';
import AcUnitIcon from '@material-ui/icons/AcUnit';


export default function Section({ icon, title, content, component }: Menu) {
  return (
    <Fragment key={title}>
      <AcUnitIcon />
      <Typography variant='h2'>
        {icon}
        {title}
      </Typography>
      {component && content ? component(content) : null}
    </Fragment>
  );
}
