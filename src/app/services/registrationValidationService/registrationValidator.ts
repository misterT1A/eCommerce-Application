import REGISTRATION_VALIDATION_RULES from './validationRules';
import type { VALID_COUNTRIES } from './validCountries';
import { COUNTRIES_PATTERNS } from './validCountries';

class RegistrationValidator {
  private static fieldTypes = ['firstName', 'lastName', 'email', 'password', 'city', 'street'] as const;

  public static validateField(value: string, type: string, country?: (typeof VALID_COUNTRIES)[number]) {
    if (![...this.fieldTypes, 'zipCode', 'date'].includes(type)) {
      return [];
    }
    if (type === 'zipCode') {
      return this.validateCountry(value, country);
    }
    if (type === 'date') {
      return this.validateDate(value);
    }
    return REGISTRATION_VALIDATION_RULES[type as (typeof this.fieldTypes)[number]].reduce(
      (acc: string[], { rule, pattern }) => {
        if (!pattern.test(value)) {
          acc.push(rule);
        }
        return acc;
      },
      []
    );
  }

  private static validateCountry(value: string, country?: (typeof VALID_COUNTRIES)[number]) {
    if (!country) {
      return ['Select country'];
    }
    if (!COUNTRIES_PATTERNS[country].pattern.test(`${value}`)) {
      return [COUNTRIES_PATTERNS[country].rule];
    }
    return [];
  }

  private static validateDate(value: string) {
    if (this.calculateAge(value) < 13) {
      return ['Age should be > 13'];
    }
    if (!value) {
      return ['Select date'];
    }
    return [];
  }

  private static calculateAge(dateOfBirth: string) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    return today.getFullYear() - birthDate.getFullYear();
  }

  public static processUserInfo(formData: IUserInfoValues | IRegistrationFormData) {
    return {
      firstName: this.validateField(formData.firstName, 'firstName'),
      lastName: this.validateField(formData.lastName, 'lastName'),
      date: this.validateField(formData.date, 'date'),
      email: this.validateField(formData.email, 'email'),
    };
  }

  public static processPasswords(formData: { currentPassword: string; newPassword: string }) {
    return {
      currentPassword: this.validateField(formData.currentPassword, 'password'),
      newPassword: this.validateField(formData.newPassword, 'password'),
    };
  }

  public static processFormData(formData: IRegistrationFormData): IRegistrationErrors {
    const result = {
      ...this.processUserInfo(formData),
      password: this.validateField(formData.password, 'password'),
    };
    if (formData.addresses.billingAddress?.commonAddress) {
      return {
        ...result,
        ...{ billingAddress: this.processAddressFormData(formData.addresses.billingAddress) },
      };
    }
    if (formData.addresses.shippingAddress?.commonAddress) {
      return {
        ...result,
        ...{ shippingAddress: this.processAddressFormData(formData.addresses.shippingAddress) },
      };
    }
    return {
      ...result,
      ...{ shippingAddress: this.processAddressFormData(formData.addresses.shippingAddress) },
      ...{ billingAddress: this.processAddressFormData(formData.addresses.billingAddress) },
    };
  }

  public static processAddressFormData(address: ProfileAddressValues | IAddressData | undefined) {
    return {
      zipCode: this.validateField(address?.zipCode ?? '', 'zipCode', address?.country),
      street: this.validateField(address?.street ?? '', 'street'),
      city: this.validateField(address?.city ?? '', 'city'),
    };
  }
}

export default RegistrationValidator;
