import FormField from '@components/form-ui-elements/formField';
import BaseComponent from '@utils/base-component';
import { button } from '@utils/elements';

import styles from '../_user-profile.scss';

type IUserInfoFormFields = Record<userFormFieldsType, FormField>;
class UserInfoEdit extends BaseComponent {
  public fields: IUserInfoFormFields = {
    firstName: new FormField('First Name', 'text'),
    lastName: new FormField('Last Name', 'text'),
    date: new FormField('Date of Birth', 'date'),
    email: new FormField('Email', 'text'),
  } as const;

  public applyButton: BaseComponent<HTMLButtonElement>;

  constructor(values: IUserInfoValues) {
    super({ tag: 'form', className: styles.profile__editUserInfoForm });
    this.applyButton = button([styles.profile__button], 'SAVE', { type: 'button' });
    this.setValues(values);
    this.appendChildren([
      this.fields.firstName,
      this.fields.lastName,
      this.fields.date,
      this.fields.email,
      this.applyButton,
    ]);
  }

  public setValues(values: IUserInfoValues) {
    this.fields.firstName.setValue(values.firstName);
    this.fields.lastName.setValue(values.lastName);
    this.fields.date.setValue(values.date);
    this.fields.email.setValue(values.email);
  }

  public getValues(): IUserInfoValues {
    return {
      firstName: this.fields.firstName.getValue(),
      lastName: this.fields.lastName.getValue(),
      date: this.fields.date.getValue(),
      email: this.fields.email.getValue(),
    };
  }
}

export default UserInfoEdit;
