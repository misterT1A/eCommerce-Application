import REGISTRATION_VALIDATION_RULES from './validationRules';
import type { VALID_COUNTRIES } from './validCountries';
import { COUNTRIES_PATTERNS } from './validCountries';

class RegistrationValidator {
  private static fieldTypes = ['firstName', 'lastName', 'email', 'password', 'city', 'street'] as const;

  public static validateField(
    value: string,
    type: (typeof this.fieldTypes)[number] | 'zipCode' | 'date',
    country?: (typeof VALID_COUNTRIES)[number]
  ) {
    if (type === 'zipCode') {
      return this.validateCountry(value, country);
    }
    if (type === 'date') {
      return this.validateDate(value);
    }
    return REGISTRATION_VALIDATION_RULES[type].reduce((acc: string[], { rule, pattern }) => {
      if (!pattern.test(value)) {
        acc.push(rule);
      }
      return acc;
    }, []);
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
}

export default RegistrationValidator;
