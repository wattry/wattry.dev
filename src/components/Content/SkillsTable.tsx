import React, { Fragment } from 'react';
import { Grid, Typography, Paper } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    background: 'rgba(66, 66, 66, 0.5)',
    width: '100%',
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  }
}));

export default function SkillsTable({ skills }: { skills: string[] }) {
  const classes = useStyles()

  return (
    <Grid container spacing={1}>
      {skills.map((skill: string, index: number) => {
        return (
          <Fragment key={index}>
            <Grid container item xs={12} sm={6} lg={4}>
              <Paper className={classes.root} elevation={3}>
                <Typography color='textPrimary' variant='body1'>
                  {skill}
                </Typography>
              </Paper>
            </Grid>
          </Fragment>
        );
      })}
    </Grid>
  );
}