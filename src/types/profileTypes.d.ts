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
  isDefault,
}

type ProfileAddressesFieldsType = keyof typeof ProfileAddressesFields;

type ProfileAddressValues = {
  country: 'UK' | 'France' | 'Belgium';
  zipCode: string;
  street: string;
  city: string;
  isBilling: boolean;
  isShipping: boolean;
  isDefault: boolean;
};
