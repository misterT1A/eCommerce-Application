import type Router from '@src/app/router/router';
import type { Props } from '@utils/base-component';
import BaseComponent from '@utils/base-component';

import styles from './_style.scss';

export default class View404 extends BaseComponent {
  protected navigate: (url: string) => void;

  constructor(router: Router) {
    super({ className: styles.wrapper });

    this.navigate = router.navigate.bind(router);

    this.setContent();
  }

  private setContent() {
    const props: Props[] = [
      { tag: 'h2', className: styles.title, textContent: '404 ERROR' },
      { tag: 'p', className: styles.text, textContent: 'This page not found;' },
      { tag: 'p', className: styles.text, textContent: 'back to home and start again' },
      { tag: 'button', className: styles.button, textContent: 'HOMEPAGE' },
    ];

    props.forEach((prop) => {
      const element = new BaseComponent(prop);
      this.append(element);
      if (prop.tag === 'button') {
        element.addListener('click', () => this.navigate(''));
      }
    });
  }
}
