import BaseComponent from '@utils/base-component';
import { button, p } from '@utils/elements';

import styles from '../_user-profile.scss';

class UserDelete extends BaseComponent {
  public confirmButton: BaseComponent<HTMLButtonElement>;

  constructor() {
    super(
      { tag: 'div', className: styles.profile__removeAddressMode },
      p([styles.profile__text], 'Are you sure you want to delete your account? This action cannot be undone.')
    );
    this.confirmButton = button([styles.profile__button], 'DELETE', { type: 'button' });
    this.append(this.confirmButton);
  }
}

export default UserDelete;
