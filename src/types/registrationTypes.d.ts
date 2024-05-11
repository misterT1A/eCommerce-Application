type IAddressFormData = {
  [k: string]: string | boolean;
  country?: 'UK' | 'France' | 'Belgium' | undefined;
};
interface IRegistrationFormData {
  [k: string]:
    | string
    | {
        shippingAddress?: {
          [k: string]: string | boolean;
        };
        billingAddress?: {
          country?: 'UK' | 'France' | 'Belgium';
          [k: string]: string | boolean;
        };
      };
}

interface IAddressData {
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
  date: string[]; // Assuming it's an array of strings, adjust if necessary
  email: string[];
  password: string[];
  billingAddress: IAddressData;
  shippingAddress: IAddressData;
}
