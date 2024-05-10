import type AddressesFieldset from '@components/form-ui-elements/addressFieldset';
import type FormField from '@components/form-ui-elements/formField';

export interface IRegistrationFormFields {
  firstName: FormField;
  lastName: FormField;
  email: FormField;
  date: FormField;
  password: FormField;
  addresses: AddressesFieldset;
}
