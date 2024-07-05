import BaseComponent from '@utils/base-component';
import { button, p } from '@utils/elements';

import styles from '../_user-profile.scss';

class UserAddressDelete extends BaseComponent {
  public confirmButton: BaseComponent<HTMLButtonElement>;

  constructor(private id: string) {
    super(
      { tag: 'div', className: styles.profile__removeAddressMode },
      p([styles.profile__text], 'Are you sure you want to remove this address? This action cannot be undone.')
    );
    this.confirmButton = button([styles.profile__button], 'REMOVE', { type: 'button' });
    this.append(this.confirmButton);
  }
}

export default UserAddressDelete;
