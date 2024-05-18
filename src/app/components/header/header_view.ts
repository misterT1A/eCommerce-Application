import logo from '@assets/headerLogo.svg';
import AuthService from '@services/auth-service';
import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import type { Props } from '@utils/base-component';
import { svg } from '@utils/elements';

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

    this.dropMenu = new BaseComponent({ className: menuStyle.backWrapper });
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
    const svgUser = svg(`./assets/img/userIcon.svg#svgElem`, styles.userlogoFill);
    const userIcon = new BaseComponent({ className: styles.userlogo }, svgUser);
    userIcon.addListener('click', () => {
      this.showDropMenu();
    });

    const svgBasket = svg(`./assets/img/basketIcon.svg#svgElem`, styles.basketLogoFill);
    const basketIcon = new BaseComponent({ className: styles.basketLogo }, svgBasket);
    basketIcon.addListener('click', () => {
      svgBasket.classList.toggle(styles.basketLogoActive);
    });

    const wrapper = new BaseComponent({ className: styles.menuBlock }, userIcon, basketIcon);
    this.append(wrapper);
  }

  private setDropMenu() {
    const isAuthorized = AuthService.isAuthorized();
    const wrapper = new BaseComponent({ tag: 'ul', className: menuStyle.wrapper });
    const props: Props[] = [
      { tag: 'li', className: menuStyle.userName, textContent: 'J. DOE' },
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
      {
        tag: 'li',
        className: menuStyle.links,
        textContent: 'Log Out',
      },
    ];
    props.forEach((prop) => {
      if (prop.textContent !== 'Log Out') {
        const element = new BaseComponent(prop);
        wrapper.append(element);
      } else if (isAuthorized) {
        const element = new BaseComponent(prop);
        wrapper.append(element);
      }
    });
    this.dropMenu.append(wrapper);
    this.dropMenu.addListener('click', (e: Event) => this.navigate(e));

    this.append(this.dropMenu);
  }

  private showDropMenu() {
    const menu = this.dropMenu.getNode();
    const icon = this.getChildren[3].getNode().children[0].children[0];

    icon.classList.toggle(styles.userlogoActive);
    menu.classList.toggle(menuStyle.wrapperActive);
    this.dropMenu.getChildren[0].getNode().classList.toggle(menuStyle.show);
  }

  private showBurgerMenu() {
    this.burgerMenu.toggleMenu();
  }

  public changeTextLoggined() {
    // const logInTitle = this.dropMenu.getChildren[1];
    // const signTitle = this.dropMenu.getChildren[2];
    // logInTitle.setTextContent('Log out');
    // signTitle.setTextContent('My Account');
    this.changeTextNotLoginned();
    const logOutTitle = new BaseComponent({ tag: 'li', className: menuStyle.links, textContent: 'Log Out' });
    this.dropMenu.getChildren[0].append(logOutTitle);

    this.burgerMenu.changeTextLoggined();
  }

  private changeTextNotLoginned() {
    // const logInTitle = this.dropMenu.getChildren[1];
    // const signTitle = this.dropMenu.getChildren[2];
    // signTitle.setTextContent('Sign Up');
    // logInTitle.setTextContent('Log In');
    const logOutTitle = this.dropMenu.getChildren[0].getChildren[3];
    logOutTitle?.destroy();
    this.dropMenu.getChildren[0].getChildren.splice(3, 1);

    this.burgerMenu.changeTextNotLoginned();
  }

  private navigate(e: Event) {
    this.showDropMenu();
    const target = (e.target as HTMLElement)?.textContent;
    if (!target) {
      return;
    }

    switch (target) {
      case 'Log In':
        this.router.navigate(Pages.LOGIN);
        break;
      case 'Sign Up':
        this.router.navigate(Pages.REG);
        break;
      case 'My Account':
        // TODO for account
        break;
      case 'Log Out':
        this.changeTextNotLoginned();
        AuthService.logout();
        break;
      default:
        break;
    }
  }
}
