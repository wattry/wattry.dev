import { Fragment, JSX } from 'react';
import {
  ListItemButton,
  List,
  SwipeableDrawer,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, scroller } from 'react-scroll';

import { Menu, SubMenu } from '../../interfaces/menu.interface';

const NestedListItemButton = styled(ListItemButton)(({ theme }) => ({
  paddingLeft: theme.spacing(5),
}));

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export default function Drawer({
  toggleDrawer,
  expanded,
}: {
  toggleDrawer: any;
  expanded: {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
  };
}): JSX.Element {
  const handleKeypress =
    (anchor: Anchor, open: boolean, title: string) => (event: React.KeyboardEvent) => {
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
            <ListItemButton
              onClick={toggleDrawer(anchor, false, title)}
              onKeyDown={handleKeypress(anchor, false, title)}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItemButton>
          </Link>
          {subMenus ? (
            <List>
              {subMenus.map(({ title, icon }: SubMenu, index) => (
                <Fragment key={index}>
                  <Link to={title} smooth={true} duration={1000}>
                    <NestedListItemButton
                      onClick={toggleDrawer(anchor, false, title)}
                      onKeyDown={handleKeypress(anchor, false, title)}>
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText primary={title} />
                    </NestedListItemButton>
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
        <Fragment key={anchor}>
          <SwipeableDrawer
            anchor={anchor}
            open={expanded[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}>
            {list(anchor)}
          </SwipeableDrawer>
        </Fragment>
      ))}
    </div>
  );
}
