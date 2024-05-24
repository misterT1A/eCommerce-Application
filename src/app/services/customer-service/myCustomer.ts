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

  public static get fullNameShort() {
    if (!this.firstName || !this.lastName) {
      return '';
    }
    return `${this.firstName[0].toUpperCase()}. ${this.lastName[0].toUpperCase()}`;
  }
}

export default MyCustomer;
