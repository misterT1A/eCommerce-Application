import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';
import type { Props } from '@utils/base-component';
import BaseComponent from '@utils/base-component';

import styles from './_burger-style.scss';

export default class BurgerMenu extends BaseComponent {
  protected router: Router;

  constructor(router: Router) {
    super({ className: styles.menuBlock });
    this.router = router;

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
    this.getNode().classList.toggle(styles.menuBlockActive);
  }

  private showDropMenu() {
    const menu = this.getBaseComponent.getNode();
    if (menu.classList.contains(styles.menuBlockActive)) {
      menu.classList.remove(styles.menuBlockActive);
    } else {
      menu.classList.add(styles.menuBlockActive);
    }
  }

  private navigate(e: Event) {
    console.log(e.target);
    this.showDropMenu();
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
