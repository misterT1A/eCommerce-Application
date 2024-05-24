import type { Customer } from '@commercetools/platform-sdk';

class MyCustomer {
  private static info: Customer | null = null;

  public static setCustomer(customer: Customer | undefined) {
    if (customer) {
      this.info = customer;
    }
  }

  public static get version() {
    return this.info?.version;
  }

  public static get id() {
    return this.info?.id?.split('-')[0] ?? '';
  }

  public static get firstName() {
    return this.info?.firstName;
  }

  public static get lastName() {
    return this.info?.lastName;
  }

  public static get fullName() {
    return `${this.firstName ?? ''} ${this.lastName ?? ''}`;
  }

  public static get inn() {
    if (!this.firstName || !this.lastName) {
      return '';
    }
    return `${this.firstName[0].toUpperCase()}${this.lastName[0].toUpperCase()}`;
  }

  public static get fullNameShort() {
    if (!this.firstName || !this.lastName) {
      return '';
    }
    return `${this.firstName[0].toUpperCase()}. ${this.lastName.toUpperCase()}`;
  }

  public static get email() {
    return this.info?.email ?? '';
  }

  public static get password() {
    const password = this.info?.password;
    if (!password) {
      return '';
    }
    return '*'.repeat(password.length);
  }

  public static get dateOfBirth() {
    const date = this.info?.dateOfBirth;
    if (!date) {
      return '';
    }
    const dateObj = new Date(date);
    return `${dateObj.getDay()}/${dateObj.getMonth()}/${dateObj.getFullYear()}`;
  }

  public static get addresses() {
    return {
      addresses: this.info?.addresses ?? [],
      billingAddressIds: this.info?.billingAddressIds ?? [],
      shippingAddressIds: this.info?.shippingAddressIds ?? [],
      defaultShippingAddress: this.info?.defaultShippingAddressId,
      defaultBillingAddress: this.info?.defaultBillingAddressId,
    };
  }

  public static getAddressById(id: string) {
    const { addresses } = this.addresses;
    return addresses.find((address) => address.id === id);
  }

  public static get defaultShippingId() {
    return this.addresses.defaultShippingAddress;
  }

  public static get defaultBillingId() {
    return this.addresses.defaultBillingAddress;
  }
}

export default MyCustomer;
