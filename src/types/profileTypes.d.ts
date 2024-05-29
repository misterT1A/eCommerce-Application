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

type ProfileAddressValues = {
  country: 'UK' | 'France' | 'Belgium';
  zipCode: string;
  street: string;
  city: string;
  isBilling: boolean;
  isShipping: boolean;
  isDefaultBilling: boolean;
  isDefaultShipping: boolean;
};

type AddressAttrs = {
  id: string;
  isBilling: boolean;
  isShipping: boolean;
  isDefaultBilling: boolean;
  isDefaultShipping: boolean;
};
