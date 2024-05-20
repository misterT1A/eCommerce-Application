import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';

import styles from './_styles.scss';

export default class MainView extends BaseComponent {
  protected router: Router;

  constructor(router: Router) {
    super({ tag: 'ul', className: styles.main });
    this.router = router;

    this.setContent();
  }

  private setContent() {
    const props: Props[] = [
      {
        tag: 'li',
        className: styles.links,
        textContent: 'Log In',
      },
      {
        tag: 'li',
        className: styles.links,
        textContent: 'Sign Up',
      },
    ];
    props.forEach((prop) => {
      const element = new BaseComponent(prop);
      this.append(element);
    });
    this.addListener('click', (e: Event) => this.navigate(e));
  }

  private navigate(e: Event) {
    const target = (e.target as HTMLElement)?.textContent;

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
