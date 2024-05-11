import FormField from '@components/form-ui-elements/formField';
import AddressesFieldset from '@components/registration-form/registration-view/addressFieldset';
import BaseComponent from '@utils/base-component';
import { button, div, h2, p, svg } from '@utils/elements';

import styles from './_registrationForm.scss';
import type { IRegistrationFormFields } from '../registrationTypes';

class RegistrationView extends BaseComponent<HTMLFormElement> {
  public fields: IRegistrationFormFields = {
    firstName: new FormField('First Name', 'text'),
    lastName: new FormField('Last Name', 'text'),
    date: new FormField('Date of Birtdth', 'date'),
    email: new FormField('Email', 'email'),
    password: new FormField('Password', 'password'),
    addresses: new AddressesFieldset(),
  };

  public button: BaseComponent<HTMLButtonElement>;

  constructor() {
    super({ tag: 'form', action: '', className: styles.form });
    this.button = button([styles.form__button], 'CREATE', { type: 'button' });
    this.appendChildren([
      h2([styles.form__title], 'Create Account'),
      p([styles.form__formText], 'Please, enter details to create an account'),
      div([styles.form__inputsWrapperSmall], this.fields.firstName, this.fields.lastName),
      this.fields.date,
      this.fields.email,
      this.fields.password,
      this.fields.addresses,
      this.button,
    ]);
    this.disableButton();

    // SVG EXAMPLE
    this.append(div([styles.svg_example], svg('./assets/img/example.svg#my-id', styles.svg_exampleIcon)));
  }

  public toggleAddress() {
    this.fields.addresses.toggleAddress();
  }

  public disableButton() {
    this.button.getNode().disabled = true;
  }

  public unlockButton() {
    this.button.getNode().disabled = false;
  }

  public getValues() {
    const values = new Map(
      Object.entries(this.fields).map(([key, field]: [string, FormField | AddressesFieldset]) => [
        key,
        field.getValue(),
      ])
    );
    return Object.fromEntries(values);
  }
}

export default RegistrationView;
