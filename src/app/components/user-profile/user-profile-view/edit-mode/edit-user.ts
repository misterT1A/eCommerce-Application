import FormField from '@components/form-ui-elements/formField';
import BaseComponent from '@utils/base-component';
import { button } from '@utils/elements';

import styles from '../_user-profile.scss';

interface IUserInfoFormFields {
  firstName: FormField;
  lastName: FormField;
  date: FormField;
  email: FormField;
}

class UserInfoEdit extends BaseComponent {
  public fields: IUserInfoFormFields = {
    firstName: new FormField('First Name', 'text'),
    lastName: new FormField('Last Name', 'text'),
    date: new FormField('Date of Birth', 'date'),
    email: new FormField('Email', 'text'),
  } as const;

  public applyButton: BaseComponent<HTMLButtonElement>;

  constructor() {
    super({ tag: 'form', className: styles.profile__editUserInfoForm });
    this.applyButton = button([styles.profile__button], 'SAVE');
    this.appendChildren([this.fields.firstName, this.fields.lastName, this.fields.date, this.fields.email]);
  }

  public getValues() {
    return {
      firstName: this.fields.firstName.getValue(),
      lastName: this.fields.lastName.getValue(),
      date: this.fields.date.getValue(),
      email: this.fields.email.getValue(),
    };
  }
}

export default UserInfoEdit;
