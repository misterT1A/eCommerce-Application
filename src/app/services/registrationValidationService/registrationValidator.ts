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
    return [];
  }

  private static calculateAge(dateOfBirth: string) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    console.debug(birthDate);
    return today.getFullYear() - birthDate.getFullYear();
  }

  public static processFormData(formData: IRegistrationFormData) {
    let result = {} as IRegistrationErrors;
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'string') {
        result = { ...result, ...Object.fromEntries([[key, this.validateField(value, key)]]) };
      } else if (typeof value === 'object' && value !== null) {
        result = {
          ...result,
          ...Object.fromEntries([['billingAddress', this.processAddressFormData(value.billingAddress)]]),
          ...Object.fromEntries([['shippingAddress', this.processAddressFormData(value.shippingAddress)]]),
        };
      }
    });
    return result;
  }

  private static processAddressFormData(address: IAddressFormData | undefined) {
    return Object.fromEntries(
      Object.entries(address ?? {}).map(([subKey, subValue]) => {
        if (typeof subValue === 'string') {
          return [subKey, this.validateField(subValue, subKey, (address as IAddressFormData).country)];
        }
        return [subKey, subValue];
      })
    );
  }
}

export default RegistrationValidator;
