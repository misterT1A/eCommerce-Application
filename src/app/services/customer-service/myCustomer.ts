import type { Address, Customer } from '@commercetools/platform-sdk';

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
    return this.info?.id;
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
    return date;
  }

  public static get dateFormatted() {
    const dateObj = new Date(this.dateOfBirth);
    return `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getDate().toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
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

  public static getAddressById(id: string): Address | undefined {
    const { addresses } = this.addresses;
    return addresses.find((address) => address.id === id);
  }

  public static get defaultShippingId() {
    return this.addresses.defaultShippingAddress;
  }

  public static get defaultBillingId() {
    return this.addresses.defaultBillingAddress;
  }

  public static isBillingAddress(id: string) {
    return this.addresses.billingAddressIds.includes(id);
  }

  public static isShippingAddress(id: string) {
    return this.addresses.shippingAddressIds.includes(id);
  }

  public static getAddressType(id: string) {
    return {
      isBilling: this.isBillingAddress(id),
      isShipping: this.isShippingAddress(id),
      isDefaultBilling: id === this.defaultBillingId,
      isDefaultShipping: id === this.defaultShippingId,
    };
  }
}

export default MyCustomer;
