import modalConstructor from '@components/disconect/disconect-view';
import FooterController from '@components/footer/footer-controller';
import HeaderController from '@components/header/header_controller';
import type Modal from '@components/modal/modal';
import ProgressBar from '@components/progress-bar/progress-bar';
import AuthService from '@services/auth-service';
import CartService from '@services/cart-service/cart-service';
import CurrentCart from '@services/cart-service/currentCart';
import { updateMyCustomerInfo } from '@services/customer-service/my-customer-service';
import MyCustomer from '@services/customer-service/myCustomer';
import ProductService from '@services/product_service/product_service';
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

  protected progressBar: ProgressBar;

  protected disconnectModal: Modal<BaseComponent>;

  constructor() {
    this.router = new Router(this.createsRoutes());

    this.wrapper = new BaseComponent({ tag: 'section', className: styles.section });
    this.headerController = new HeaderController(this.router);
    this.main = new BaseComponent({ tag: 'main', className: styles.main });
    this.footerController = new FooterController(this.router);

    this.progressBar = new ProgressBar();

    this.controller = null;
    this.disconnectModal = modalConstructor();

    this.setListeners();
  }

  private setListeners() {
    document.addEventListener('DOMContentLoaded', async () => {
      await AuthService.sessionStateHandler();
      if (CurrentCart.id) {
        await CartService.updateCart(CurrentCart.id);
        this.headerController.setCartCount(CurrentCart.totalCount);
      }
      await CartService.updateDiscountCodes();
      await ProductService.getCommercetoolsData();
      await updateMyCustomerInfo();
      this.headerController.updateTextLoggined(MyCustomer.fullNameShort);
      this.footerController.setContent();
      this.router.navigateToLastPoint();
    });

    window.addEventListener('offline', () => {
      this.disconnectModal = modalConstructor();
      this.disconnectModal.open();
    });
    window.addEventListener('online', () => this.disconnectModal.close());
  }

  public showContent(parent: HTMLElement) {
    this.wrapper.appendChildren([
      this.headerController.getView.getNode(),
      this.progressBar.getNode(),
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
          await this.hideMain();
          this.controller = new MainController(this.router);
          this.setContent();
        },
      },
      {
        path: Pages.LOGIN,
        callBack: async () => {
          const { default: LoginController } = await import('@components/login-form/login-controller');
          await this.hideMain();
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
          await this.hideMain();
          this.controller = new RegistrationController(this.router, this.headerController);
          this.setContent();
        },
      },
      {
        path: Pages.CATALOG,
        callBack: async (filtersParams: string[]) => {
          const { default: CatalogController } = await import('@components/catalog/catalog-controller');
          await this.hideMain();
          this.controller = new CatalogController(this.router, filtersParams, this.headerController);
          this.setContent();
        },
      },
      {
        path: Pages.PRODUCT,
        callBack: async (productName: string) => {
          const { default: ProductController } = await import('@components/product-page/product-controller');
          await this.hideMain();
          this.controller = new ProductController(this.router, productName, this.headerController);
          this.setContent();
        },
      },
      {
        path: Pages.ERROR,
        callBack: async () => {
          const { default: Controller } = await import('@components/404/404_controller');
          await this.hideMain();
          this.controller = new Controller(this.router);
          this.setContent();
        },
      },
      {
        path: Pages.ACCOUNT,
        callBack: async () => {
          const { default: Controller } = await import('@components/user-profile/user-profile-controller');
          await this.hideMain();
          this.controller = new Controller(this.router, this.headerController);
          this.setContent();
        },
      },
      {
        path: Pages.CART,
        callBack: async () => {
          const { default: CartController } = await import('@components/cart/cart-controller');
          await this.hideMain();
          this.controller = new CartController(this.router, this.headerController);
          this.setContent();
        },
      },
      {
        path: Pages.ABOUT,
        callBack: async () => {
          const { default: Controller } = await import('@components/about us/about_us-controller');
          await this.hideMain();
          this.controller = new Controller(this.router);
          this.setContent();
        },
      },
    ];
  }

  private setContent() {
    this.deleteContent();
    this.controller?.showContent(this.main);
    this.main.removeClass(styles.main_hide);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private async hideMain() {
    this.main.addClass(styles.main_hide);
    await new Promise((res) => {
      setTimeout(() => res(true), 300);
    });
  }

  private deleteContent() {
    this.main.destroyChildren();
  }
}
