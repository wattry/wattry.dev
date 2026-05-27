import { Fragment } from 'react';
import { Grid, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const SkillPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(66, 66, 66, 0.5)',
  width: '100%',
  paddingTop: theme.spacing(1),
  paddingLeft: theme.spacing(1),
}));

export default function SkillsTable({ skills }: { skills: string[] }) {
  return (
    <Grid container spacing={1}>
      {skills.map((skill: string, index: number) => {
        return (
          <Fragment key={index}>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <SkillPaper elevation={3}>
                <Typography color='textPrimary' variant='body1'>
                  {skill}
                </Typography>
              </SkillPaper>
            </Grid>
          </Fragment>
        );
      })}
    </Grid>
  );
}
