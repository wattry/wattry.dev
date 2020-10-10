import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {
  ShortText,
  ImportantDevices,
  DoneAll,
  Highlight,
  Work,
  History,
  Alarm,
  School,
} from '@material-ui/icons';

declare interface SubMenu {
  title: string;
  icon: JSX.Element;
}

declare interface Menu {
  title: string;
  icon: JSX.Element;
  subMenus?: SubMenu[];
}

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
const menuItems = [
  {
    title: 'Summary',
    icon: <ShortText />,
  },
  {
    title: 'Skills',
    icon: <ImportantDevices />,
  },
  {
    title: 'Experience',
    icon: <DoneAll />,
  },
  {
    title: 'Career',
    icon: <Work />,
    subMenus: [
      {
        title: 'Highlights',
        icon: <Highlight />,
      },
      {
        title: 'History',
        icon: <History />,
      },
      {
        title: 'Early Career',
        icon: <Alarm />,
      },
    ],
  },
  {
    title: 'Education',
    icon: <School />,
  },
];

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
          <>
            <ListItem button key={title}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItem>
            {subMenus ? (
              <List>
                {subMenus.map(({ title, icon }: SubMenu, index) => (
                  <ListItem button key={title} className={classes.nested}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={title} />
                  </ListItem>
                ))}
              </List>
            ) : null}
          </>
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
