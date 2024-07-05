import { prepareAddresses, prepareCustomerDraft } from '../registration-adapters';

describe('prepareAddresses', () => {
  const validShippingAddress: IAddressData = {
    defaultAddress: true,
    commonAddress: false,
    city: 'London',
    street: 'Baker Street',
    country: 'UK',
    zipCode: 'NW1 PP',
  };

  const validBillingAddressCommon: IAddressData = {
    defaultAddress: false,
    commonAddress: true,
    city: 'Paris',
    street: 'TTTTTnn sdf',
    country: 'France',
    zipCode: '75008',
  };

  const validAddressCommonDefault: IAddressData = {
    defaultAddress: true,
    commonAddress: true,
    city: 'Paris',
    street: 'TTTTTnn sdf',
    country: 'France',
    zipCode: '75008',
  };

  const validBillingAddress: IAddressData = {
    defaultAddress: false,
    commonAddress: false,
    city: 'Paris',
    street: 'TTTTTnn sdf',
    country: 'France',
    zipCode: '75008',
  };

  it('Should return correct addresses when both shipping and billing addresses are provided and not common', () => {
    const formData: IRegistrationFormData = {
      email: 'test@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
      date: '2000-01-01',
      addresses: {
        shippingAddress: validShippingAddress,
        billingAddress: validBillingAddress,
      },
    };

    const result = prepareAddresses(formData);
    expect(result).toEqual({
      addresses: [
        {
          country: 'GB',
          city: 'London',
          postalCode: 'NW1 PP',
          streetName: 'Baker Street',
        },
        {
          country: 'FR',
          city: 'Paris',
          postalCode: '75008',
          streetName: 'TTTTTnn sdf',
        },
      ],
      shippingAddresses: [0],
      billingAddresses: [1],
      defaultShippingAddress: 0,
    });
  });

  it('Should return correct addresses when shipping address is provided as common', () => {
    const formData: IRegistrationFormData = {
      email: 'test@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
      date: '2000-01-01',
      addresses: {
        shippingAddress: validBillingAddressCommon,
      },
    };

    const result = prepareAddresses(formData);
    expect(result).toEqual({
      addresses: [
        {
          country: 'FR',
          city: 'Paris',
          postalCode: '75008',
          streetName: 'TTTTTnn sdf',
        },
      ],
      shippingAddresses: [0],
      billingAddresses: [0],
    });
  });

  it('Should return correct addresses when shipping address is provided as common and default', () => {
    const formData1: IRegistrationFormData = {
      email: 'test@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
      date: '2000-01-01',
      addresses: {
        shippingAddress: validAddressCommonDefault,
      },
    };

    const res = prepareAddresses(formData1);
    expect(res).toEqual({
      addresses: [
        {
          country: 'FR',
          city: 'Paris',
          postalCode: '75008',
          streetName: 'TTTTTnn sdf',
        },
      ],
      shippingAddresses: [0],
      billingAddresses: [0],
      defaultShippingAddress: 0,
      defaultBillingAddress: 0,
    });
  });

  it('Should return correct addresses when billing address is provided as common', () => {
    const formData: IRegistrationFormData = {
      email: 'test@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
      date: '2000-01-01',
      addresses: {
        billingAddress: validBillingAddressCommon,
        shippingAddress: validBillingAddress,
      },
    };

    const result = prepareAddresses(formData);
    expect(result).toEqual({
      addresses: [
        {
          country: 'FR',
          city: 'Paris',
          postalCode: '75008',
          streetName: 'TTTTTnn sdf',
        },
      ],
      shippingAddresses: [0],
      billingAddresses: [0],
    });
  });
});

describe('prepareCustomerDraft', () => {
  const validAddress: IAddressData = {
    defaultAddress: true,
    commonAddress: false,
    city: 'London',
    street: 'Baker Street',
    country: 'UK',
    zipCode: 'NW1 PP',
  };
  it('Should return correct CustomerDraft object when form data is provided', () => {
    const formData: IRegistrationFormData = {
      email: 'test@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
      date: '2000-01-01',
      addresses: {
        billingAddress: validAddress,
        shippingAddress: validAddress,
      },
    };

    const result = prepareCustomerDraft(formData);
    expect(result).toEqual({
      email: 'test@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2000-01-01',
      addresses: [
        {
          country: 'GB',
          city: 'London',
          postalCode: 'NW1 PP',
          streetName: 'Baker Street',
        },
        {
          country: 'GB',
          city: 'London',
          postalCode: 'NW1 PP',
          streetName: 'Baker Street',
        },
      ],
      shippingAddresses: [0],
      billingAddresses: [1],
      defaultShippingAddress: 0,
      defaultBillingAddress: 1,
      authenticationMode: 'Password',
    });
  });
});
