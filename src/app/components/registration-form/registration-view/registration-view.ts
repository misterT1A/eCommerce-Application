import FormField from '@components/form-ui-elements/formField';
import AddressesFieldset from '@components/registration-form/registration-view/addressFieldset';
import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { a, button, div, h2, p } from '@utils/elements';

import styles from './_registrationForm.scss';
import type { IRegistrationFormFields } from '../registrationTypes';

class RegistrationView extends BaseComponent<HTMLFormElement> {
  public fields: IRegistrationFormFields = {
    firstName: new FormField('First Name', 'text'),
    lastName: new FormField('Last Name', 'text'),
    date: new FormField('Date of Birth', 'date'),
    email: new FormField('Email', 'text'),
    password: new FormField('Password', 'password'),
    addresses: new AddressesFieldset(),
  } as const;

  public button: BaseComponent<HTMLButtonElement>;

  constructor(private router: Router) {
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
      div(
        [styles.form__footer],
        p([styles.form__formText], 'Already have an account?'),
        a([styles.form__formLink], {
          href: './login',
          text: 'Login',
          navigate: () => this.router.navigate(Pages.LOGIN),
        })
      ),
    ]);
    this.disableButton();
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
    const values = Object.entries(this.fields).map(([key, field]: [string, FormField | AddressesFieldset]) => [
      key,
      field.getValue(),
    ]);
    return Object.fromEntries(values) as IRegistrationFormData;
  }
}

export default RegistrationView;
