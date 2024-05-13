type IAddressFormData = {
  [k: string]: string | boolean;
  country?: 'UK' | 'France' | 'Belgium' | undefined;
};
interface IRegistrationFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  date: string;

  addresses: {
    shippingAddress: IAddressData;
    billingAddress: IAddressData;
  };
}

interface IAddressData {
  defaultAddress: boolean;
  commonAddress: boolean;
  city: string;
  street: string;
  country: 'UK' | 'France' | 'Belgium';
  zipCode: string;
  [k: string]: string | boolean;
}

interface IAddressDataErrors {
  defaultAddress: boolean;
  commonAddress: boolean;
  city: string[];
  street: string[];
  country: string[];
  zipCode: string[];
}

interface IRegistrationErrors {
  firstName: string[];
  lastName: string[];
  date: string[];
  email: string[];
  password: string[];
  billingAddress: IAddressDataErrors;
  shippingAddress: IAddressDataErrors;
}

// TODO: add interfaces for reusable UI form elements
