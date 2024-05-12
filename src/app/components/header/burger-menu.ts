import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';
import type { Props } from '@utils/base-component';
import BaseComponent from '@utils/base-component';

import styles from './_burger-style.scss';
import mainStyles from './_style.scss';

export default class BurgerMenu extends BaseComponent {
  protected router: Router;

  protected burgerBtn: BaseComponent;

  constructor(router: Router, btn: BaseComponent) {
    super({ className: styles.menuBlock });
    this.router = router;

    this.burgerBtn = btn;

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
    this.getBaseComponent.addListener('click', (e: Event) => this.navigate(e));
  }

  public toggleMenu() {
    this.burgerBtn.getNode().classList.toggle(mainStyles.burgerBtn_active);
    this.getNode().classList.toggle(styles.menuBlockActive);
  }

  private navigate(e: Event) {
    this.toggleMenu();
    const target = (e.target as HTMLElement)?.textContent;
    if (!target) {
      return;
    }

    switch (target) {
      case 'HOME':
        this.router.navigate(Pages.MAIN);
        break;
      case 'CATALOG':
        // this.router.navigate(Pages.REG);
        break;
      case 'ABOUT US':
        // this.router.navigate(Pages.REG);
        break;
      default:
        break;
    }
  }
}
