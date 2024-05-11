import logo from '@assets/headerLogo.svg';
import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import type { Props } from '@utils/base-component';

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
    this.burgerMenu = new BurgerMenu(router);
    this.burgerBtn = new BaseComponent({ classList: styles.burgerBtn });

    this.setBurgerComponents();
    this.setLogo();
    this.setUserBlock();
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

  private setUserBlock() {
    const userBox = new BaseComponent<HTMLInputElement>({
      tag: 'input',
      type: 'checkbox',
      className: styles.userCheckbox,
      id: 'user',
    });
    const userLabel = new BaseComponent<HTMLLabelElement>({
      tag: 'label',
      className: styles.userLogo,
      htmlFor: 'user',
    });
    userBox.addListener('click', () => this.showDropMenu());

    const basket = new BaseComponent({
      tag: 'div',
      className: styles.basketLogo,
    });
    const wrapper = new BaseComponent({ className: styles.menuBlock }, userLabel, userBox, basket);
    this.append(wrapper);
  }

  private setDropMenu() {
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
    if (menu.classList.contains(menuStyle.show)) {
      menu.classList.remove(menuStyle.show);
    } else {
      menu.classList.add(menuStyle.show);
    }
  }

  private showBurgerMenu() {
    this.burgerBtn.getNode().classList.toggle(styles.burgerBtn_active);
    this.burgerMenu.toggleMenu();
  }

  private navigate(e: Event) {
    console.log(e.target);
    this.showDropMenu();
    const target = (e.target as HTMLElement)?.textContent;
    if (!target) {
      return;
    }
    // to do for logged in user

    switch (target) {
      case 'Log In':
        this.router.navigate(Pages.LOGIN);
        break;
      case 'Sign Up':
        this.router.navigate(Pages.REG);
        break;
      default:
        break;
    }
  }
}
