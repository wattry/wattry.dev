import React, { Fragment, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Divider,
  ListItem,
  List,
  SwipeableDrawer,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { Link } from 'react-scroll';

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
  expanded,
  setExpanded,
}: {
  expanded: {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
  };
  setExpanded: any;
}): JSX.Element {
  const classes = useStyles();
  const toggleDrawer = (anchor: Anchor, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    console.log('expanded', expanded, anchor);

    setExpanded({ ...expanded, [anchor]: open });
  };

  const list = (anchor: Anchor): JSX.Element => (
    <div role='presentation'>
      <List>
        {menuItems.map(({ title, icon, subMenus }: Menu, index) => (
          <Fragment key={index}>
            <Link to={title} smooth={true} duration={1000}>
              <ListItem
                onClick={toggleDrawer(anchor, false)}
                onKeyDown={toggleDrawer(anchor, false)}>
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
                        className={classes.nested}
                        onClick={toggleDrawer(anchor, false)}
                        onKeyDown={toggleDrawer(anchor, false)}>
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
      <Divider />
    </div>
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
