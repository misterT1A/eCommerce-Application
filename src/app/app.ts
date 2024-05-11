import HeaderController from '@components/header/controller';
import BaseComponent from '@utils/base-component';

import styles from './_app_style.scss';
import Pages from './router/pages';
import Router from './router/router';

export default class App {
  protected router: Router;

  protected controller: IController | null;

  protected wrapper: BaseComponent;

  protected header: HeaderController;

  protected main: BaseComponent;

  constructor() {
    this.wrapper = new BaseComponent({ tag: 'section', className: styles.section });
    this.header = new HeaderController();
    this.main = new BaseComponent({ tag: 'main', className: styles.main });

    this.controller = null;

    this.router = new Router(this.createsRoutes());
  }

  public showContent(parent: HTMLElement) {
    this.wrapper.appendChildren([this.header.getView.getNode(), this.main.getNode()]);
    parent.append(this.wrapper.getNode());
  }

  private createsRoutes(): IRoute[] {
    return [
      {
        path: Pages.START,
        callBack: async () => {
          // const { default: Controller } = await import('@components/);
          // this.controller = new Controller(this.router);
          // this.setContent();
        },
      },
      {
        path: Pages.LOGIN,
        callBack: async () => {},
      },
      {
        path: Pages.REG,
        callBack: () => {},
      },
      {
        path: Pages.MAIN,
        callBack: () => {},
      },
      {
        path: Pages.ERROR,
        callBack: async () => {
          const { default: Controller } = await import('@components/404/404_controller');
          this.controller = new Controller(this.router);
          this.setContent();
        },
      },
    ];
  }

  private setContent() {
    this.deleteContent();
    this.controller?.showContent(this.main);
  }

  private deleteContent() {
    this.main.destroyChildren();
  }
}
