import React, { Fragment } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ArrowForwardIos from '@material-ui/icons/ArrowForwardIos';

import { History } from '../../interfaces/history.interface';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  achievements: {
    '& h4': {
      marginBottom: theme.spacing(1),
    },
  },
}));

export default ({ history }: { history: History[] }): JSX.Element => {
  const classes = useStyles();

  return (
    <Fragment>
      {history.map(
        (
          { employer, position, dates, description, summary, keyAchievements }: History,
          index: number,
        ) => {
          return (
            <Fragment key={index}>
              <Typography gutterBottom={false} color='textPrimary' variant='body1'>
                {employer}
              </Typography>
              <Typography gutterBottom={false} color='textPrimary' variant='body1'>
                {position}
              </Typography>
              <Typography gutterBottom={false} color='textPrimary' variant='body1'>
                {dates}
              </Typography>
              <Typography align='justify' color='textPrimary' variant='subtitle1'>
                {description}
              </Typography>
              <ul>
                {summary.map((paragraph: string, index: number) => (
                  <li key={index}>
                    <Typography align='justify' color='textPrimary' variant='body1'>
                      <ArrowForwardIos fontSize='small' />
                      {paragraph}
                    </Typography>
                  </li>
                ))}
              </ul>
              {keyAchievements ? (
                <div className={classes.achievements}>
                  <Typography color='textPrimary' variant='h5' component='h4'>
                    Key Achievements
                  </Typography>
                  {keyAchievements.map((paragraph: string, index) => {
                    return (
                      <div key={index}>
                        <Typography align='justify' color='textPrimary' variant='body1'>
                          <ArrowForwardIos fontSize='small' /> {paragraph}
                        </Typography>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </Fragment>
          );
        },
      )}
    </Fragment>
  );
};
