import React from 'react';
import { Divider, Zoom, useScrollTrigger, Fab } from '@mui/material';
import { KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import menuItems from '../../menuItems';
import Section from '../content/Section';
import { Menu, SubMenu } from '../../interfaces/menu.interface';

const MainBox = styled('div')(({ theme }) => ({
  position: 'relative',
  background: 'rgba(0, 0, 0, 0.5)',
  paddingLeft: theme.spacing(2),
  display: 'flex',
}));

const Content = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
  width: '100%',
  '& h2': {
    marginBottom: theme.spacing(2),
  },
  '& svg': {
    marginRight: theme.spacing(1),
  },
}));

const SectionBox = styled('div')(({ theme }) => ({
  '& p': {
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  '& li': {
    marginBottom: theme.spacing(2),
    listStyleType: 'none',
  },
}));

const SubMenuBox = styled('div')(({ theme }) => ({
  paddingLeft: theme.spacing(1),
}));

const BackToTop = styled('div')(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}));

function ScrollTop(props: { children: any }) {
  const { children } = props;

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
      <BackToTop onClick={handleClick} role='presentation' style={{ zIndex: 10000 }}>
        {children}
      </BackToTop>
    </Zoom>
  );
}

export default function Main(props: any): JSX.Element {
  return (
    <main>
      <MainBox>
        <Content>
          {menuItems.map(({ title, icon, content, component, subMenus }: Menu, index) => (
            <SectionBox key={index}>
              <Section title={title} icon={icon} content={content} component={component} />
              {subMenus?.map(
                ({ title, icon, content, component }: SubMenu, index: number, array: SubMenu[]) => (
                  <SubMenuBox key={index}>
                    <Section title={title} icon={icon} content={content} component={component} />
                    {index !== array.length - 1 ? <Divider component='li' /> : null}
                  </SubMenuBox>
                ),
              )}
              <Divider component='li' />
            </SectionBox>
          ))}
        </Content>
        <ScrollTop {...props}>
          <Fab color='default' size='large' aria-label='scroll back to top'>
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </MainBox>
    </main>
  );
}
