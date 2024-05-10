import AddressesFieldset from '@components/form-ui-elements/addressFieldset';
import FormField from '@components/form-ui-elements/formField';
import BaseComponent from '@utils/base-component';
import { button, div } from '@utils/elements';

import styles from './registrationForm.scss';
import type { IRegistrationFormFields } from './registrationTypes';

class RegistrationView extends BaseComponent {
  private form: BaseComponent<HTMLElement>;

  private fields: IRegistrationFormFields;

  public button: BaseComponent<HTMLButtonElement>;

  constructor() {
    super({ tag: 'div', className: styles.form__wrapper });
    this.form = new BaseComponent<HTMLFormElement>({ tag: 'form', action: '' });
    this.form.addClass(styles.form);
    this.fields = {
      firstName: new FormField('First Name', 'text', ''),
      lastName: new FormField('Last Name', 'text', ''),
      date: new FormField('Date Of Bitdth', 'date', ''),
      email: new FormField('Email', 'email', ''),
      password: new FormField('Password', 'password', ''),
      addresses: new AddressesFieldset(),
    };
    this.button = button([styles.form__button], 'CREATE', { type: 'submit' });
    this.form.appendChildren([
      div([styles.form__inputsWrapperSmall], this.fields.firstName, this.fields.lastName),
      this.fields.email,
      this.fields.password,
      this.fields.addresses,
      this.button,
    ]);
    this.appendChildren([this.form]);
  }

  public getValues() {}

  public render() {
    document.body.append(this.getNode());
  }

  public getForm() {
    return this.form;
  }
}

export default RegistrationView;
