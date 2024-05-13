import type { BaseAddress, CustomerDraft } from '@commercetools/platform-sdk';

import { COUNTRIES_PATTERNS } from '@services/registrationValidationService/validCountries';

export function prepareAddresses(formData: IRegistrationFormData) {
  const billingAddress = formData?.addresses.billingAddress;
  const shippingAddress = formData?.addresses.shippingAddress;
  const formAddress = (address: IAddressData): BaseAddress => ({
    country: COUNTRIES_PATTERNS[address.country].code,
    city: address.city,
    postalCode: address.zipCode,
    streetName: address.street,
  });
  const addresses: BaseAddress[] = [];
  if (shippingAddress) {
    addresses.push(formAddress(shippingAddress));
  }
  if (billingAddress) {
    addresses.push(formAddress(billingAddress));
  }
  let res = {
    addresses,
    shippingAddresses: [0],
    billingAddresses: [1],
  };
  if (shippingAddress?.defaultAddress) {
    res = Object.assign(res, { defaultShippingAddress: 0 });
  }
  if (billingAddress?.defaultAddress) {
    res = Object.assign(res, { defaultBillingAddress: 1 });
  }
  if (billingAddress?.commonAddress) {
    res.shippingAddresses.push(1);
  }
  if (shippingAddress?.commonAddress) {
    res.billingAddresses.push(0);
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
    // anonymousId: , --
    authenticationMode: 'Password',
  };
}
