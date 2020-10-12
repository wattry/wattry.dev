import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  ListItem,
  List,
  SwipeableDrawer,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { Link, scroller } from 'react-scroll';

import menuItems from '../../menuItems';
import { Menu, SubMenu } from '../../interfaces/menu.interface';

const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  nested: {
    paddingLeft: theme.spacing(5),
  },
  zoom: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function Drawer({
  toggleDrawer,
  expanded
}: {
    toggleDrawer: any,
    expanded: {
      top: boolean,
      bottom: boolean,
      left: boolean,
      right: boolean
    }
}): JSX.Element {
  const classes = useStyles();
  const handleKeypress = (anchor: Anchor, open: boolean, title: string) => (
    event: React.KeyboardEvent,
  ) => {
    if (event.key === 'Enter') {
      scroller.scrollTo(title, {
        duration: 1500,
        delay: 100,
        smooth: true,
      });
      toggleDrawer(anchor, open);
    }
  };

  const list = (anchor: Anchor): JSX.Element => (
    <List>
      {menuItems.map(({ title, icon, subMenus }: Menu, index) => (
        <Fragment key={index}>
          <Link to={title} smooth={true} duration={1000}>
            <ListItem
              button
              onClick={toggleDrawer(anchor, false, title)}
              onKeyDown={handleKeypress(anchor, false, title)}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItem>
          </Link>
          {subMenus ? (
            <List>
              {subMenus.map(({ title, icon }: SubMenu, index) => (
                <Fragment key={index}>
                  <Link to={title} smooth={true} duration={1000}>
                    <ListItem
                      button
                      className={classes.nested}
                      onClick={toggleDrawer(anchor, false, title)}
                      onKeyDown={handleKeypress(anchor, false, title)}>
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText primary={title} />
                    </ListItem>
                  </Link>
                </Fragment>
              ))}
            </List>
          ) : null}
        </Fragment>
      ))}
    </List>
  );

  return (
    <div>
      {(['left', 'right', 'top'] as Anchor[]).map((anchor) => (
        <React.Fragment key={anchor}>
          <SwipeableDrawer
            anchor={anchor}
            open={expanded[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}>
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
