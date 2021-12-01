import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core';
import { Divider, Zoom, useScrollTrigger, Fab } from '@material-ui/core';
import {
  KeyboardArrowUp as KeyboardArrowUpIcon
} from '@material-ui/icons';

import menuItems from '../../menuItems';
import Section from '../content/Section';
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
      marginTop: theme.spacing(2),
      // paddingRight: theme.spacing(1),
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
    backToTop: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }),
);

function ScrollTop(props: { children: any }) {
  const { children } = props;
  const classes = useStyles();

  const trigger = useScrollTrigger({
    target: window,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = ((event.target as HTMLDivElement).ownerDocument || document).querySelector(
      '#top-anchor',
    );

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role='presentation' className={classes.backToTop} style={{ zIndex: 10000 }}>
        {children}
      </div>
    </Zoom>
  );
}

export default function Main(props: any): JSX.Element {
  const classes = useStyles();

  return (
    <main>
      <div className={classes.main}>
        <div className={classes.content}>
          {menuItems.map(({ title, icon, content, component, subMenus }: Menu, index) => (
            <div className={classes.section} key={index}>
              <Section title={title} icon={icon} content={content} component={component} />
              {subMenus?.map(
                ({ title, icon, content, component }: SubMenu, index: number, array: SubMenu[]) => (
                  <div className={classes.subMenu} key={index}>
                    <Section title={title} icon={icon} content={content} component={component} />
                    {index !== array.length - 1 ? <Divider component='li' /> : null}
                  </div>
                ),
              )}
              <Divider component='li' />
            </div>
          ))}
        </div>
        <ScrollTop {...props}>
          <Fab color='default' size='large' aria-label='scroll back to top'>
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </div>
    </main>
  );
}
