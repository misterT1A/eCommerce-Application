import type { CustomerChangePassword, CustomerUpdate, CustomerUpdateAction } from '@commercetools/platform-sdk';

import MyCustomer from '@services/customer-service/myCustomer';
import { COUNTRIES_PATTERNS } from '@services/registrationValidationService/validCountries';
import getISODate from '@utils/date-helpers';

import { getCountryName } from './profile-helpers';

export function getUserInfoUpdateRequest(values: IUserInfoValues): CustomerUpdate {
  const actions: CustomerUpdateAction[] = [];
  if (MyCustomer.email !== values.email) {
    actions.push({
      action: 'changeEmail',
      email: values.email,
    });
  }
  if (MyCustomer.firstName !== values.firstName) {
    actions.push({
      action: 'setFirstName',
      firstName: values.firstName,
    });
  }
  if (MyCustomer.lastName !== values.lastName) {
    actions.push({
      action: 'setLastName',
      lastName: values.lastName,
    });
  }
  const dateString = getISODate(new Date(values.date));
  if (MyCustomer.dateOfBirth !== dateString) {
    actions.push({
      action: 'setDateOfBirth',
      dateOfBirth: dateString,
    });
  }
  return {
    version: MyCustomer.version ?? 1,
    actions,
  };
}

const formAddressRequest = (values: ProfileAddressValues) => ({
  streetName: values.street,
  postalCode: values.zipCode,
  city: values.city,
  country: COUNTRIES_PATTERNS[values.country].code,
});

export function getAddressAddRequest(values: ProfileAddressValues, version?: number) {
  const action: CustomerUpdateAction = {
    action: 'addAddress',
    address: formAddressRequest(values),
  };
  return {
    version: version ?? MyCustomer.version ?? 1,
    actions: [action],
  };
}

export function getAddressEditRequest(values: ProfileAddressValues, addressId: string, version?: number) {
  const action: CustomerUpdateAction = {
    action: 'changeAddress',
    addressId,
    address: formAddressRequest(values),
  };
  return {
    version: version ?? MyCustomer.version ?? 1,
    actions: [action],
  };
}

export function getAddressTypeRequest(newAddress: AddressAttrs, prevAddress?: AddressAttrs, version?: number) {
  const actions: CustomerUpdateAction[] = [];
  let refAddress = prevAddress;
  if (!prevAddress) {
    refAddress = {
      id: newAddress.id,
      isBilling: false,
      isShipping: false,
      isDefaultShipping: false,
      isDefaultBilling: false,
    };
  }
  if (newAddress.isBilling !== refAddress?.isBilling) {
    actions.push({
      action: newAddress.isBilling ? 'addBillingAddressId' : 'removeBillingAddressId',
      addressId: newAddress.id,
    });
  }
  if (newAddress.isShipping !== refAddress?.isShipping) {
    actions.push({
      action: newAddress.isShipping ? 'addShippingAddressId' : 'removeShippingAddressId',
      addressId: newAddress.id,
    });
  }
  if (newAddress.isDefaultBilling) {
    actions.push({
      action: 'setDefaultBillingAddress',
      addressId: newAddress.id,
    });
  } else if (refAddress?.isDefaultBilling) {
    actions.push({
      action: 'setDefaultBillingAddress',
      addressId: undefined,
    });
  }
  if (newAddress.isDefaultShipping) {
    actions.push({
      action: 'setDefaultShippingAddress',
      addressId: newAddress.id,
    });
  } else if (refAddress?.isDefaultShipping) {
    actions.push({
      action: 'setDefaultShippingAddress',
      addressId: undefined,
    });
  }
  return {
    version: version ?? MyCustomer.version ?? 1,
    actions,
  };
}

export function getAddressValuesById(id: string) {
  const address = MyCustomer.getAddressById(id);
  return {
    country: getCountryName(address?.country ?? '') as 'UK' | 'Belgium' | 'France',
    zipCode: address?.postalCode ?? '',
    street: address?.streetName ?? '',
    city: address?.city ?? '',
    ...MyCustomer.getAddressType(id),
  };
}

export function getRemoveAddressRequest(addressId: string, version?: number) {
  const action: CustomerUpdateAction = {
    action: 'removeAddress',
    addressId,
  };
  return {
    version: version ?? MyCustomer.version ?? 1,
    actions: [action],
  };
}

export function getSetDefaultAddressRequest(type: 'Shipping' | 'Billing', id: string, reset = false) {
  const actions: CustomerUpdateAction[] = [
    {
      action: `setDefault${type}Address`,
      addressId: reset ? undefined : id,
    },
  ];
  if (!MyCustomer[`is${type}Address`](id)) {
    actions.push({
      action: `add${type}AddressId`,
      addressId: reset ? undefined : id,
    });
  }
  return {
    version: MyCustomer.version ?? 0,
    actions,
  };
}

export function getChangePasswordRequest(passwords: {
  currentPassword: string;
  newPassword: string;
}): CustomerChangePassword {
  return {
    id: MyCustomer.id ?? '',
    version: MyCustomer.version ?? 0,
    currentPassword: passwords.currentPassword,
    newPassword: passwords.newPassword,
  };
}
