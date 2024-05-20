import type { BaseAddress, CustomerDraft } from '@commercetools/platform-sdk';

import { COUNTRIES_PATTERNS } from '@services/registrationValidationService/validCountries';

const formAddress = (address: IAddressData): BaseAddress => ({
  country: COUNTRIES_PATTERNS[address.country]?.code,
  city: address.city,
  postalCode: address.zipCode,
  streetName: address.street,
});

function setCommonAddress(address: IAddressData) {
  let res = {
    shippingAddresses: [0],
    billingAddresses: [0],
  };
  if (address.defaultAddress) {
    res = { ...res, ...{ defaultBillingAddress: 0 } };
    res = { ...res, ...{ defaultShippingAddress: 0 } };
  }
  return res;
}

export function prepareAddresses(formData: IRegistrationFormData) {
  const billingAddress = formData?.addresses.billingAddress;
  const shippingAddress = formData?.addresses.shippingAddress;
  const addresses: BaseAddress[] = [];
  if (shippingAddress && !billingAddress?.commonAddress) {
    addresses.push(formAddress(shippingAddress));
  }
  if (billingAddress && !shippingAddress?.commonAddress) {
    addresses.push(formAddress(billingAddress));
  }
  if (billingAddress?.commonAddress) {
    return { addresses, ...setCommonAddress(billingAddress) };
  }
  if (shippingAddress?.commonAddress) {
    return { addresses, ...setCommonAddress(shippingAddress) };
  }
  let res = {
    addresses,
    shippingAddresses: [0],
    billingAddresses: [1],
  };
  if (shippingAddress?.defaultAddress) {
    res = { ...res, ...{ defaultShippingAddress: 0 } };
  }
  if (billingAddress?.defaultAddress) {
    res = { ...res, ...{ defaultBillingAddress: 1 } };
  }
  return res;
}

export function prepareCustomerDraft(formData: IRegistrationFormData): CustomerDraft {
  return {
    email: formData.email,
    password: formData.password,
    firstName: formData.firstName,
    lastName: formData.lastName,
    dateOfBirth: new Date(formData.date).toISOString().split('T')[0],
    ...prepareAddresses(formData),
    authenticationMode: 'Password',
  };
}
