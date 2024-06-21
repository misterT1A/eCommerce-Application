enum UserFormFields {
  firstName,
  lastName,
  date,
  email,
}

type userFormFieldsType = keyof typeof UserFormFields;

type IUserInfoValues = Record<userFormFieldsType, string>;

enum ProfileAddressesFields {
  country,
  zipCode,
  street,
  city,
  isBilling,
  isShipping,
  isDefaultShipping,
  isDefaultBilling,
}

type ProfileAddressesFieldsType = keyof typeof ProfileAddressesFields;

type AddressType = {
  isBilling: boolean;
  isShipping: boolean;
  isDefaultBilling: boolean;
  isDefaultShipping: boolean;
};

type CountryType = 'UK' | 'France' | 'Belgium';

type ProfileAddressInfoType = {
  country: CountryType;
  zipCode: string;
  street: string;
  city: string;
};

type ProfileAddressValues = ProfileAddressInfoType & AddressType;

type AddressAttrs = {
  id: string;
} & AddressType;

type AddressesInfo = {
  addresses: Address[];
  billingAddressIds: string[];
  shippingAddressIds: string[];
  defaultShippingAddress: string | undefined;
  defaultBillingAddress: string | undefined;
};
