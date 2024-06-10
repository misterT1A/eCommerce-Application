import logo from '@assets/headerLogo.svg';
import AuthService from '@services/auth-service';
import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { span, svg } from '@utils/elements';

import menuStyle from './_dropMenu.scss';
import styles from './_style.scss';
import BurgerMenu from './burger-menu';

export default class HeaderView extends BaseComponent {
  protected dropMenu: BaseComponent;

  protected burgerMenu: BurgerMenu;

  protected burgerBtn: BaseComponent;

  protected router: Router;

  constructor(router: Router) {
    super({ tag: 'header', className: styles.header });
    this.router = router;

    this.dropMenu = new BaseComponent({ className: menuStyle.wrapper });
    this.burgerBtn = new BaseComponent({ classList: styles.burgerBtn });
    this.burgerMenu = new BurgerMenu(router, this.burgerBtn, this.changeTextNotLoginned.bind(this));

    this.setBurgerComponents();
    this.setLogo();
    this.setIconsBlock();
    this.setDropMenu();
  }

  private setBurgerComponents() {
    this.burgerBtn.addListener('click', () => this.showBurgerMenu());

    const element = new BaseComponent<HTMLSpanElement>({ tag: 'span', className: styles.burgerBtnIcon });
    this.burgerBtn.append(element);

    this.appendChildren([this.burgerBtn, this.burgerMenu]);
  }

  private setLogo() {
    const img = new BaseComponent<HTMLImageElement>({ tag: 'img', src: logo, className: styles.logo });
    this.append(img);
  }

  private setIconsBlock() {
    const svgUser = svg(`/assets/img/userIcon.svg#svgElem`, styles.userlogoFill);
    const userIcon = new BaseComponent({ className: styles.userlogo }, svgUser);
    userIcon.addListener('click', () => {
      this.showDropMenu();
    });

    const svgBasket = svg(`/assets/img/basketIcon.svg#svgElem`, styles.basketLogoFill);
    const basketIcon = new BaseComponent({ className: styles.basketLogo }, svgBasket);
    basketIcon.addListener('click', () => {
      this.router.navigate(Pages.CART);
    });

    const wrapper = new BaseComponent({ className: styles.menuBlock }, userIcon, basketIcon);
    this.append(wrapper);
  }

  // throw 0 to remove counter, and another number above 0 to display the counter
  public setCartCount(count: number) {
    const parrent = this.getChildren[3].getChildren[1];
    if (count > 0) {
      const countElem = span([styles.cart_count_wrapper], count.toString());
      parrent.append(countElem);
    } else {
      const countElem = parrent.getChildren[0];
      if (countElem) {
        parrent.destroyChildren();
      }
    }
  }

  private setDropMenu() {
    const isAuthorized = AuthService.isAuthorized();
    const props: Props[] = [
      { tag: 'li', className: menuStyle.userName, textContent: 'ACCOUNT' },
      {
        tag: 'li',
        className: menuStyle.links,
        textContent: 'Log In',
      },
      {
        tag: 'li',
        className: menuStyle.links,
        textContent: 'Sign Up',
      },
    ];
    props.forEach((prop) => {
      if (prop.textContent !== 'Log Out') {
        const element = new BaseComponent(prop);
        this.dropMenu.append(element);
      } else if (isAuthorized) {
        const element = new BaseComponent(prop);
        this.dropMenu.append(element);
      }
    });
    this.dropMenu.addListener('click', (e: Event) => this.navigate(e));
    this.append(this.dropMenu);
  }

  private showDropMenu() {
    const menu = this.dropMenu.getNode();
    const icon = this.getChildren[3].getNode().children[0].children[0];

    icon.classList.toggle(styles.userlogoActive);
    menu.classList.toggle(menuStyle.wrapperActive);
    this.dropMenu.getNode().classList.toggle(menuStyle.show);
  }

  private showBurgerMenu() {
    this.burgerMenu.toggleMenu();
  }

  public changeTextLoggined(name = 'ACCOUNT') {
    const logInTitle = this.dropMenu.getChildren[1];
    const signTitle = this.dropMenu.getChildren[2];
    signTitle.setTextContent('Log Out');
    logInTitle.setTextContent('My Account');
    this.dropMenu.getChildren[0].setTextContent(name);
    this.burgerMenu.changeTextLoggined();
  }

  public changeTextNotLoginned() {
    const logInTitle = this.dropMenu.getChildren[1];
    const signTitle = this.dropMenu.getChildren[2];
    signTitle.setTextContent('Sign Up');
    logInTitle.setTextContent('Log In');
    this.dropMenu.getChildren[0].setTextContent('ACCOUNT');
    this.burgerMenu.changeTextNotLoginned();
  }

  private navigate(e: Event) {
    this.showDropMenu();
    const target = (e.target as HTMLElement)?.textContent;

    switch (target) {
      case 'Log In':
        this.router.navigate(Pages.LOGIN);
        break;
      case 'Sign Up':
        this.router.navigate(Pages.REG);
        break;
      case 'My Account':
        this.router.navigate(Pages.ACCOUNT);
        break;
      case 'Log Out':
        this.changeTextNotLoginned();
        AuthService.logout();
        this.router.navigateToLastPoint();
        break;
      default:
        break;
    }
  }
}
