enum UserFormFields {
  firstName,
  lastName,
  date,
  email,
}

type userFormFieldsType = keyof typeof UserFormFields;

type IUserInfoValues = Record<userFormFieldsType, string>;
