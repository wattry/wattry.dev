import { History } from './history.interface';

export interface SubMenu {
  title: string;
  content: any;
  component: (content: any) => JSX.Element;
  icon: JSX.Element;
}

export interface Menu {
  title: string;
  content?: any;
  component?: (content: any) => JSX.Element;
  icon: JSX.Element;
  subMenus?: SubMenu[];
}
