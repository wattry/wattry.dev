import React from 'react';
import { Typography } from '@material-ui/core';

export default function List({ paragraphs }: { paragraphs: string[] }): JSX.Element {
  return (
    <ul>
      {paragraphs.map((paragraph: string, index: number) => (
        <li key={index}>
          <Typography align='justify' color='textPrimary' variant='body1'>
            {paragraph}
          </Typography>
        </li>
      ))}
    </ul>
  );
}
