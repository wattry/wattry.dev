import { Fragment } from 'react';
import { Typography } from '@mui/material';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/material/styles';

import { History } from '../../interfaces/history.interface';

const Achievements = styled('div')(({ theme }) => ({
  '& h4': {
    marginBottom: theme.spacing(1),
  },
}));

const HistoryComponent = ({ history }: { history: History[] }): JSX.Element => {
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
                <Achievements>
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
                </Achievements>
              ) : null}
            </Fragment>
          );
        },
      )}
    </Fragment>
  );
};

export default HistoryComponent;
