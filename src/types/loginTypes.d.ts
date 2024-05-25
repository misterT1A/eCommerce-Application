interface IFormValidatorResult {
  success: boolean;
  errors: string[];
}

interface ILoginData {
  email: string;
  password: string;
}

interface ICustomer {
  readonly id: string;
  readonly version: number;
  readonly key?: string;
  readonly customerNumber?: string;
  readonly externalId?: string;
  readonly createdAt: string;
  readonly lastModifiedAt: string;
  readonly lastModifiedBy?: LastModifiedBy;
  readonly createdBy?: CreatedBy;
  readonly email: string;
  readonly password?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly middleName?: string;
  readonly title?: string;
  readonly dateOfBirth?: string;
  readonly companyName?: string;
  readonly vatId?: string;
  readonly addresses: Address[];
  readonly defaultShippingAddressId?: string;
  readonly shippingAddressIds?: string[];
  readonly defaultBillingAddressId?: string;
  readonly billingAddressIds?: string[];
  readonly isEmailVerified: boolean;
  readonly customerGroup?: CustomerGroupReference;
  readonly custom?: CustomFields;
  readonly locale?: string;
  readonly salutation?: string;
  readonly stores: StoreKeyReference[];
  readonly authenticationMode: AuthenticationMode;
}

interface ILoginResult {
  success: true | false;
  message: string;
  customer?: ICustomer;
  errors?: string[];
}
