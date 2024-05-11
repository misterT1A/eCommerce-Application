import type FormField from '@components/form-ui-elements/formField';
import type AddressesFieldset from '@components/registration-form/registration-view/addressFieldset';

export interface IRegistrationFormFields {
  firstName: FormField;
  lastName: FormField;
  email: FormField;
  date: FormField;
  password: FormField;
  addresses: AddressesFieldset;
}
