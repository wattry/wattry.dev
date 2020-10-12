import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core';
import { Divider } from '@material-ui/core';

import menuItems from '../../menuItems';
import Section from '../Content/Section';
import { Menu, SubMenu } from '../../interfaces/menu.interface';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      position: 'relative',
      background: 'rgba(0, 0, 0, 0.5)',
      paddingLeft: theme.spacing(2),
      display: 'flex',
    },
    content: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(1),
      paddingRight: theme.spacing(1),
      width: '100%',
      '& h2': {
        marginBottom: theme.spacing(2),
      },
      '& svg': {
        marginRight: theme.spacing(1),
      },
    },
    section: {
      '& p': {
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(2),
      },
      '& li': {
        marginBottom: theme.spacing(2),
        listStyleType: 'none',
      },
    },
    subMenu: {
      paddingLeft: theme.spacing(1),
    },
  }),
);

export default function Main(props: any): JSX.Element {
  const classes = useStyles();

  return (
    <main>
      <div className={classes.main}>
        <div className={classes.content}>
          {menuItems.map(({ title, icon, content, component, subMenus }: Menu, index) => (
            <div className={classes.section} key={index}>
              <Section title={title} icon={icon} content={content} component={component} />
              {subMenus?.map(({ title, icon, content, component }: SubMenu, index: number) => (
                <div className={classes.subMenu} key={index}>
                  <Section title={title} icon={icon} content={content} component={component} />
                  <Divider component='li' variant='inset' />
                </div>
              ))}
              <Divider component='li' />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
