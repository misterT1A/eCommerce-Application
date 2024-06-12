import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';

import styles from './_about_us-styles.scss';

export default class AboutUsView extends BaseComponent {
  constructor(protected router: Router) {
    super({ className: styles.wrapper });
  }
}
