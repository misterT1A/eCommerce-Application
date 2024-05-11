import logo from '@assets/headerLogo.svg';
import BaseComponent from '@utils/base-component';
import type { Props } from '@utils/base-component';

import menuStyle from './_dropMenu.scss';
import styles from './_style.scss';

export default class HeaderView extends BaseComponent {
  constructor() {
    super({ tag: 'header', className: styles.header });

    this.setMenuBlock();
    this.setLogo();
    this.setUserBlock();
    this.setDropMenu();
  }

  private setMenuBlock() {
    const props: Props[] = [
      { tag: 'span', textContent: 'HOME', className: styles.menuBtn },
      {
        tag: 'span',
        textContent: 'CATALOG',
        className: styles.menuBtn,
      },
      {
        tag: 'span',
        textContent: 'ABOUT US',
        className: styles.menuBtn,
      },
    ];

    const wrapper = new BaseComponent<HTMLDivElement>({ className: styles.menuBlock });

    props.forEach((prop) => wrapper.append(new BaseComponent(prop)));

    this.appendChildren([wrapper]);
  }

  private setLogo() {
    const img = new BaseComponent<HTMLImageElement>({ tag: 'img', src: logo, className: styles.logo });
    this.appendChildren([img]);
  }

  private setUserBlock() {
    const user = new BaseComponent({ tag: 'div', className: styles.userLogo });
    const basket = new BaseComponent({
      tag: 'div',
      className: styles.basketLogo,
    });
    const wrapper = new BaseComponent({ className: styles.menuBlock }, user, basket);
    this.appendChildren([wrapper]);
  }

  private setDropMenu() {
    const userName = new BaseComponent({ tag: 'span', className: menuStyle.userName, textContent: 'J. DOE' });
    const logBtn = new BaseComponent({
      tag: 'span',
      className: menuStyle.links,
      textContent: 'Log In',
    });
    const registerMyAccount = new BaseComponent({
      tag: 'div',
      className: menuStyle.links,
      textContent: 'Sign Up',
    });

    const wrapper = new BaseComponent({ className: menuStyle.wrapper }, userName, logBtn, registerMyAccount);
    this.appendChildren([wrapper]);
  }
}
