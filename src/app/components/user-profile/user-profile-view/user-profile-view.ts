import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { h2 } from '@utils/elements';

import styles from './_user-profile.scss';

class ProfileView extends BaseComponent<HTMLElement> {
  constructor(private router: Router) {
    super({ tag: 'div', className: styles.profile }, h2([styles.profile__title], 'My Account'));
  }
}

export default ProfileView;
