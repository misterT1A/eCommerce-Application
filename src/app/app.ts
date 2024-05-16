import FooterController from '@components/footer/footer-controller';
import HeaderController from '@components/header/header_controller';
import BaseComponent from '@utils/base-component';

import styles from './_app_style.scss';
import Pages from './router/pages';
import Router from './router/router';

export default class App {
  protected router: Router;

  protected controller: IController | null;

  protected wrapper: BaseComponent;

  protected headerController: HeaderController;

  protected main: BaseComponent;

  protected footerController: FooterController;

  constructor() {
    this.router = new Router(this.createsRoutes());

    this.wrapper = new BaseComponent({ tag: 'section', className: styles.section });
    this.headerController = new HeaderController(this.router);
    this.main = new BaseComponent({ tag: 'main', className: styles.main });
    this.footerController = new FooterController(this.router);

    this.controller = null;
  }

  public showContent(parent: HTMLElement) {
    this.wrapper.appendChildren([
      this.headerController.getView.getNode(),
      this.main.getNode(),
      this.footerController.getView.getNode(),
    ]);
    parent.append(this.wrapper.getNode());
  }

  private createsRoutes(): IRoute[] {
    return [
      {
        path: Pages.MAIN,
        callBack: async () => {
          const { default: MainController } = await import('@components/main/main-controller');
          this.controller = new MainController(this.router);
          this.setContent();
        },
      },
      {
        path: Pages.LOGIN,
        callBack: async () => {
          const { default: LoginController } = await import('@components/login-form/login-controller');
          this.controller = new LoginController(this.router, this.headerController);
          this.setContent();
        },
      },
      {
        path: Pages.REG,
        callBack: async () => {
          const { default: RegistrationController } = await import(
            '@components/registration-form/registration-controller'
          );
          this.controller = new RegistrationController();
          this.setContent();
        },
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
