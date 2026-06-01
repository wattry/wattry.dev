import { JSX } from 'react';

export interface SubMenu {
  title: string;
  content: any;
  component?: (content: any) => JSX.Element;
  icon: JSX.Element;
}

export interface Menu {
  title: string;
  content?: any;
  component?: (content: any) => JSX.Element;
  icon: JSX.Element;
  subMenus?: SubMenu[];
}
