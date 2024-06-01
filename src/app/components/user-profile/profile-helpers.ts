import type { Address, CustomerUpdate } from '@commercetools/platform-sdk';

import FormField from '@components/form-ui-elements/formField';
import notificationEmitter from '@components/notifications/notifications-controller';
import AuthService from '@services/auth-service';
import { updateMyCustomerInfo } from '@services/customer-service/my-customer-service';
import MyCustomer from '@services/customer-service/myCustomer';
import RegistrationValidator from '@services/registrationValidationService/registrationValidator';
import type BaseComponent from '@utils/base-component';
import { div, span } from '@utils/elements';

import styles from './user-profile-view/_user-profile.scss';
import type ChangePassword from './user-profile-view/edit-mode/change-password';
import type UserAddressEdit from './user-profile-view/edit-mode/edit-address';
import type UserInfoEdit from './user-profile-view/edit-mode/edit-user';

export function generateAddressTags(markers: AddressType) {
  const tags: BaseComponent[] = [];
  if (markers.isBilling && !markers.isDefaultBilling) {
    tags.push(span([styles.profile__addressTag], `billing`));
  }
  if (markers.isShipping && !markers.isDefaultShipping) {
    tags.push(span([styles.profile__addressTag], `shipping`));
  }
  if (markers.isDefaultBilling) {
    tags.push(span([styles.profile__addressTag], `billing default`));
  }
  if (markers.isDefaultShipping) {
    tags.push(span([styles.profile__addressTag], `shipping default`));
  }
  return tags;
}

export function generateTagsById(addressID: string) {
  const markers = {
    isBilling: MyCustomer.addresses.billingAddressIds.includes(addressID),
    isShipping: MyCustomer.addresses.shippingAddressIds.includes(addressID),
    isDefaultBilling: MyCustomer.addresses.defaultBillingAddress === addressID,
    isDefaultShipping: MyCustomer.addresses.defaultShippingAddress === addressID,
  };
  return generateAddressTags(markers);
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

export async function prepareMyCustomer(logout: () => Promise<void>) {
  const customerUpdate = await updateMyCustomerInfo();
  if (!customerUpdate.success) {
    if (customerUpdate.message === 'Not authorized') {
      await logout();
      notificationEmitter.showMessage({
        messageType: 'warning',
        title: 'You are not authorized!',
        text: 'Please, log in or sign up to access your account.',
      });
      return {
        isAuthorized: false,
      };
    }
    await AuthService.sessionStateHandler();
    await updateMyCustomerInfo();
  }
  return {
    isAuthorized: true,
  };
}

export function getCountryName(code: string) {
  const map = new Map([
    ['GB', 'UK'],
    ['BE', 'Belgium'],
    ['FR', 'France'],
  ]);
  return map.get(code) ?? '';
}

const wrapField = (label: string, field: BaseComponent) =>
  div([styles.profile__userInfoDataWrapper], span([styles.profile__userInfoDataLabel], label), field);

export function getAddressFields(values: ProfileAddressInfoType) {
  return [
    wrapField('City:', span([styles.profile__addressesField], values.city)),
    wrapField('Street:', span([styles.profile__addressesField], values.street)),
    wrapField('Country:', span([styles.profile__addressesField], values.country)),
    wrapField('Postal Code:', span([styles.profile__addressesField], values.zipCode)),
  ];
}
export function getAddressView(address: Address) {
  const values: ProfileAddressInfoType = {
    city: address?.city ?? '',
    street: address?.streetName ?? '',
    country: (getCountryName(address?.country ?? '') ?? '') as CountryType,
    zipCode: address?.postalCode ?? '',
  };
  return getAddressFields(values);
}

export function processUserData(form: UserInfoEdit) {
  let isValidForm = true;
  const errorsObject = RegistrationValidator.processUserInfo(form.getValues());
  Object.entries(errorsObject).forEach(([key, errors]) => {
    if (errors.length > 0) {
      isValidForm = false;
    }
    form.fields[key as userFormFieldsType].updateErrors(errors);
  });
  return {
    isValidForm,
  };
}

export function getAddressTitle(addressType: { isBilling: boolean; isShipping: boolean }) {
  const label = addressType.isBilling ? 'Billing Address' : 'Shipping Address';
  return addressType.isShipping && addressType.isBilling ? 'Billing/Shipping Address' : label;
}
