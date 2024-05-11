import RegistrationValidator from '../registrationValidator';
import { COUNTRIES_PATTERNS } from '../validCountries';

describe('RegistrationValidator name fields', () => {
  it('validates firstName field', () => {
    const testData: { value: string; expectedErrors: string[] }[] = [
      { value: '', expectedErrors: ['Name must contain at least one character and no special characters or numbers'] },
      { value: 'John', expectedErrors: [] },
      {
        value: '123John',
        expectedErrors: ['Name must contain at least one character and no special characters or numbers'],
      },
      {
        value: '!@#$',
        expectedErrors: ['Name must contain at least one character and no special characters or numbers'],
      },
    ];

    testData.forEach(({ value, expectedErrors }) => {
      const errors = RegistrationValidator.validateField(value, 'firstName');
      expect(errors).toEqual(expectedErrors);
    });
  });

  it('validates lastName field', () => {
    const errors = RegistrationValidator.validateField('', 'lastName');
    expect(errors).toContain('Name must contain at least one character and no special characters or numbers');
  });
});

describe('RegistrationValidator email and password fields', () => {
  it('validates email field', () => {
    const errors = RegistrationValidator.validateField('invalidemail', 'email');
    expect(errors).toContain('Should be a properly formatted email address.');
  });

  it('validates password field', () => {
    const errors = RegistrationValidator.validateField('wedsfda', 'password');
    expect(errors).toContain('Minimum 8 characters');
    expect(errors).toContain('Should contain at least 1 uppercase letter');
    expect(errors).toContain('Should contain at least 1 number');
  });

  it('validates date field', () => {
    const errors = RegistrationValidator.validateField('2015-05-07', 'date');
    expect(errors).toContain('Age should be > 13');
  });
});

describe('RegistrationValidator address fields', () => {
  it('validates city field', () => {
    const errors = RegistrationValidator.validateField('', 'city');
    expect(errors).toContain('Must contain at least one character and no special characters or numbers');
  });

  it('validates street field', () => {
    const errors = RegistrationValidator.validateField('', 'street');
    expect(errors).toContain('Must contain at least one character');
  });

  it('validates zipCode field for UK', () => {
    const errors = RegistrationValidator.validateField('invalid', 'zipCode', 'UK');
    expect(errors).toContain(COUNTRIES_PATTERNS.UK.rule);
  });

  it('validates zipCode field for France', () => {
    const errors = RegistrationValidator.validateField('invalid', 'zipCode', 'France');
    expect(errors).toContain(COUNTRIES_PATTERNS.France.rule);
  });

  it('validates zipCode field for Belgium', () => {
    const errors = RegistrationValidator.validateField('invalid', 'zipCode', 'Belgium');
    expect(errors).toContain(COUNTRIES_PATTERNS.Belgium.rule);
  });

  it('validates zipCode field without country', () => {
    const errors = RegistrationValidator.validateField('invalid', 'zipCode');
    expect(errors).toContain('Select country');
  });
});