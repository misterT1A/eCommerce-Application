import logo from '@assets/headerLogo.svg';
import BaseComponent from '@utils/base-component';
import type { Props } from '@utils/base-component';

import menuStyle from './_dropMenu.scss';
import styles from './_style.scss';
import BurgerMenu from './burger-menu';

export default class HeaderView extends BaseComponent {
  protected dropMenu: BaseComponent;

  protected burgerMenu: BurgerMenu;

  protected burgerBtn: BaseComponent;

  constructor() {
    super({ tag: 'header', className: styles.header });

    this.dropMenu = new BaseComponent({ tag: 'ul', className: menuStyle.wrapper });
    this.burgerMenu = new BurgerMenu(this.getBaseComponent);
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
    const userLabel = new BaseComponent<HTMLLabelElement>({ tag: 'label', className: styles.userLogo });
    userLabel.getNode().setAttribute('for', 'user');
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
    props.forEach((prop) => this.dropMenu.append(new BaseComponent(prop)));
    this.appendChildren([this.dropMenu]);
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
}
