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

    this.dropMenu = new BaseComponent({ tag: 'ul', className: menuStyle.wrapper });
    this.burgerBtn = new BaseComponent({ classList: styles.burgerBtn });
    this.burgerMenu = new BurgerMenu(router, this.burgerBtn);

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
    const svgUser = svg(`./assets/img/userIcon.svg#svgElem`, styles.svglogoFill);
    const userIcon = new BaseComponent({ className: styles.svglogo }, svgUser);
    userIcon.addListener('click', () => {
      this.showDropMenu();
    });

    const svgBasket = svg(`./assets/img/basketIcon.svg#svgElem`, styles.svglogoFill);
    const basketIcon = new BaseComponent({ className: styles.svglogo }, svgBasket);
    basketIcon.addListener('click', () => {
      svgBasket.classList.toggle(styles.svglogoActive);
    });

    const wrapper = new BaseComponent({ className: styles.menuBlock }, userIcon, basketIcon);
    this.append(wrapper);
  }

  private setDropMenu() {
    const isAuthorized = AuthService.isAuthorized();

    const props: Props[] = [
      { tag: 'li', className: menuStyle.userName, textContent: 'J. DOE' },
      {
        tag: 'li',
        className: menuStyle.links,
        textContent: isAuthorized ? 'Log out' : 'Log In',
      },
      {
        tag: 'li',
        className: menuStyle.links,
        textContent: isAuthorized ? 'My Account' : 'Sign Up',
      },
    ];
    props.forEach((prop) => {
      const element = new BaseComponent(prop);
      this.dropMenu.append(element);
    });

    this.dropMenu.addListener('click', (e: Event) => this.navigate(e));

    this.append(this.dropMenu);
  }

  private showDropMenu() {
    const menu = this.dropMenu.getNode();
    const icon = this.getChildren[3].getNode().children[0].children[0];

    if (menu.classList.contains(menuStyle.show)) {
      icon.classList.remove(styles.svglogoActive);
      menu.classList.remove(menuStyle.show);
    } else {
      menu.classList.add(menuStyle.show);
      icon.classList.add(styles.svglogoActive);
    }
  }

  private showBurgerMenu() {
    this.burgerMenu.toggleMenu();
  }

  public changeTextLoggined() {
    const logInTitle = this.dropMenu.getChildren[1];
    const signTitle = this.dropMenu.getChildren[2];
    logInTitle.setTextContent('Log out');
    signTitle.setTextContent('My Account');
  }

  private changeTextNotLoginned() {
    const logInTitle = this.dropMenu.getChildren[1];
    const signTitle = this.dropMenu.getChildren[2];
    signTitle.setTextContent('Sign Up');
    logInTitle.setTextContent('Log In');
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
      case 'Log out':
        this.changeTextNotLoginned();
        AuthService.logout();
        break;
      default:
        break;
    }
  }
}
