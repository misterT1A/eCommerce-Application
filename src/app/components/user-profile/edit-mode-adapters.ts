import type { CustomerUpdate, CustomerUpdateAction } from '@commercetools/platform-sdk';

import MyCustomer from '@services/customer-service/myCustomer';
import { COUNTRIES_PATTERNS } from '@services/registrationValidationService/validCountries';
import getISODate from '@utils/date-helpers';

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

type AddressAttrs = { id: string; isBilling: boolean; isShipping: boolean; isDefault: boolean };

export function getAddressTypeRequest(newAddress: AddressAttrs, prevAddress?: AddressAttrs, version?: number) {
  const actions: CustomerUpdateAction[] = [];
  let refAddress = prevAddress;
  if (!prevAddress) {
    refAddress = {
      id: newAddress.id,
      isBilling: false,
      isShipping: false,
      isDefault: false,
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
  if (newAddress.isDefault) {
    if (newAddress.isBilling) {
      actions.push({
        action: 'setDefaultBillingAddress',
        addressId: newAddress.id,
      });
    }
    if (newAddress.isShipping) {
      actions.push({
        action: 'setDefaultShippingAddress',
        addressId: newAddress.id,
      });
    }
  }
  return {
    version: version ?? MyCustomer.version ?? 1,
    actions,
  };
}

export function getAddressesInfoUpdate() {
  //
}

export function getCountryName(code: string) {
  const map = new Map([
    ['GB', 'UK'],
    ['BE', 'Belgium'],
    ['FR', 'France'],
  ]);
  return map.get(code) ?? '';
}
