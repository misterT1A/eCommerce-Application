import FormField from '@components/form-ui-elements/formField';
import BaseComponent from '@utils/base-component';
import { button, p } from '@utils/elements';

import styles from '../_user-profile.scss';

class ChangePassword extends BaseComponent {
  public fields = {
    currentPassword: new FormField('Current password', 'password'),
    newPassword: new FormField('New password', 'password'),
    confirmPassword: new FormField('Confirm new password', 'password'),
  } as const;

  public confirmButton: BaseComponent<HTMLButtonElement>;

  constructor() {
    super({ tag: 'div', className: styles.profile__changePassword }, p([styles.profile__text], ''));
    this.confirmButton = button([styles.profile__button], 'APPLY', { type: 'button' });
    this.appendChildren([
      this.fields.currentPassword,
      this.fields.newPassword,
      this.fields.confirmPassword,
      this.confirmButton,
    ]);
  }

  public getValues() {
    return {
      currentPassword: this.fields.currentPassword.getValue(),
      newPassword: this.fields.newPassword.getValue(),
      confirmPassword: this.fields.confirmPassword.getValue(),
    };
  }
}

export default ChangePassword;
