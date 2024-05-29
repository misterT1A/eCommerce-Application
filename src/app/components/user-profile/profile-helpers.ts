import type { CustomerUpdate } from '@commercetools/platform-sdk';

import FormField from '@components/form-ui-elements/formField';
import MyCustomer from '@services/customer-service/myCustomer';
import RegistrationValidator from '@services/registrationValidationService/registrationValidator';
import type BaseComponent from '@utils/base-component';
import { span } from '@utils/elements';

import styles from './user-profile-view/_user-profile.scss';
import type ChangePassword from './user-profile-view/edit-mode/change-password';
import type UserAddressEdit from './user-profile-view/edit-mode/edit-address';

export default function generateTags(addressID: string) {
  const markers = {
    billing: MyCustomer.addresses.billingAddressIds.includes(addressID),
    shipping: MyCustomer.addresses.shippingAddressIds.includes(addressID),
    defaultBilling: MyCustomer.addresses.defaultBillingAddress === addressID,
    defaultShipping: MyCustomer.addresses.defaultShippingAddress === addressID,
  };
  const tags: BaseComponent[] = [];
  if (markers.billing && !markers.defaultBilling) {
    tags.push(span([styles.profile__addressTag], `billing`));
  }
  if (markers.shipping && !markers.defaultShipping) {
    tags.push(span([styles.profile__addressTag], `shipping`));
  }
  if (markers.defaultBilling) {
    tags.push(span([styles.profile__addressTag], `billing default`));
  }
  if (markers.defaultShipping) {
    tags.push(span([styles.profile__addressTag], `shipping default`));
  }
  return tags;
}

export function processAddressData(form: UserAddressEdit) {
  let isValidForm = true;
  const errorsObject = RegistrationValidator.processAddressFormData(form.getValues());
  Object.entries(errorsObject).forEach(([key, errors]) => {
    if (errors.length > 0) {
      isValidForm = false;
    }
    const field = form.fields[key as ProfileAddressesFieldsType];
    if (field instanceof FormField) {
      field.updateErrors(errors);
    }
  });
  return {
    isValidForm,
  };
}

export function processPasswordData(form: ChangePassword) {
  let isValidForm = true;
  const errorsObject = RegistrationValidator.processPasswords(form.getValues());
  Object.entries(errorsObject).forEach(([key, errors]) => {
    if (errors.length > 0) {
      isValidForm = false;
    }
    const field = form.fields[key as 'newPassword' | 'currentPassword'];
    field.updateErrors(errors);
  });
  return {
    isValidForm,
  };
}

export function getLogsFromRequestBody(customerUpdateRequest: CustomerUpdate) {
  const actions: string[] = [];
  customerUpdateRequest.actions.forEach((action) => {
    if (action.action === 'changeEmail') {
      actions.push('email');
    }
    if (action.action === 'setFirstName') {
      actions.push('first name');
    }
    if (action.action === 'setLastName') {
      actions.push('last name');
    }
    if (action.action === 'setDateOfBirth') {
      actions.push('date of birth');
    }
  });
  const changes = actions?.slice(1)?.join(', ') ?? '';
  if (actions.length > 1) {
    return `The ${changes} and ${actions[0]} are updated.`;
  }
  if (actions.length === 1) {
    return `The ${actions[0]} is updated.`;
  }
  return '';
}
