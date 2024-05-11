import type { Props } from '@utils/base-component';
import BaseComponent from '@utils/base-component';

import styles from './_burger-style.scss';

export default class BurgerMenu extends BaseComponent {
  constructor() {
    super({ className: styles.menuBlock });
    this.setMenuContent();
  }

  private setMenuContent() {
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
    props.forEach((prop) => this.getBaseComponent.append(new BaseComponent(prop)));
  }

  public toggleMenu() {
    this.getNode().classList.toggle(styles.menuBlockActive);
  }
}
