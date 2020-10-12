import React, { Fragment, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

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
}));

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function Drawer(props: {
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

    props.setExpanded({ ...props.expanded, [anchor]: open });
  };

  const list = (anchor: Anchor): JSX.Element => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role='presentation'
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}>
      <List>
        {menuItems.map(({ title, icon, subMenus }: Menu, index) => (
          <Fragment key={index}>
            <ListItem button key={index}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItem>
            {subMenus ? (
              <List>
                {subMenus.map(({ title, icon }: SubMenu, index) => (
                  <ListItem button key={index} className={classes.nested}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={title} />
                  </ListItem>
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
            open={props.expanded[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}>
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}
