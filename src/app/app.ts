import BaseComponent from '@utils/base-component';

import Pages from './router/pages';
import Router from './router/router';

export default class App extends BaseComponent {
  protected router: Router;

  constructor() {
    super({ tag: 'section' });

    this.router = new Router(this.createsRoutes());
  }

  public showContent(parent: HTMLElement) {
    parent.append(this.node);
  }

  private createsRoutes(): IRoute[] {
    return [
      {
        path: Pages.START,
        callBack: () => {
          this.deleteContent();
          // callback for view
        },
      },
      {
        path: Pages.LOGIN,
        callBack: () => {
          this.deleteContent();
          // callback for view
        },
      },
      {
        path: Pages.REG,
        callBack: () => {
          this.deleteContent();
          // callback for view
        },
      },
      {
        path: Pages.MAIN,
        callBack: () => {
          this.deleteContent();
          // callback for view
        },
      },
    ];
  }

  private deleteContent() {
    this.destroyChildren();
  }
}
