import BaseComponent from '@utils/base-component';

import Pages from './router/pages';
import Router from './router/router';

export default class App {
  protected router: Router;

  protected controller: IController | null;

  protected element: BaseComponent;

  constructor() {
    this.element = new BaseComponent({ tag: 'section' });

    this.controller = null;

    this.router = new Router(this.createsRoutes());
  }

  public showContent(parent: HTMLElement) {
    parent.append(this.element.getNode());
  }

  private createsRoutes(): IRoute[] {
    return [
      {
        path: Pages.START,
        callBack: async () => {
          const { default: Controller } = await import('@components/login/controller');
          this.controller = new Controller();
          this.setContent();
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
    ];
  }

  private setContent() {
    this.deleteContent();
    this.controller?.showContent(this.element);
  }

  private deleteContent() {
    this.element.destroyChildren();
  }
}
