import RegistrationValidator from '../registrationValidator';
import { COUNTRIES_PATTERNS } from '../validCountries';

describe('RegistrationValidator name fields', () => {
  it('validates firstName field', () => {
    const testData: { value: string; expectedErrors: string[] }[] = [
      { value: '', expectedErrors: ['First name must contain letters A-Z and no special characters or numbers'] },
      { value: 'John', expectedErrors: [] },
      {
        value: '123John',
        expectedErrors: ['First name must contain letters A-Z and no special characters or numbers'],
      },
      {
        value: '!@#$',
        expectedErrors: ['First name must contain letters A-Z and no special characters or numbers'],
      },
    ];

    testData.forEach(({ value, expectedErrors }) => {
      const errors = RegistrationValidator.validateField(value, 'firstName');
      expect(errors).toEqual(expectedErrors);
    });
  });

  it('validates lastName field', () => {
    const testData: { value: string; expectedErrors: string[] }[] = [
      { value: '', expectedErrors: ['Last name must contain letters A-Z and no special characters or numbers'] },
      { value: 'John', expectedErrors: [] },
      {
        value: '123John',
        expectedErrors: ['Last name must contain letters A-Z and no special characters or numbers'],
      },
      {
        value: '!@#$%',
        expectedErrors: ['Last name must contain letters A-Z and no special characters or numbers'],
      },
    ];

    testData.forEach(({ value, expectedErrors }) => {
      const errors = RegistrationValidator.validateField(value, 'lastName');
      expect(errors).toEqual(expectedErrors);
    });
  });
});

describe('RegistrationValidator email and password fields', () => {
  it('validates email field', () => {
    const testData: { value: string; expectedErrors: string[] }[] = [
      { value: 'kjsfdh', expectedErrors: ['Should be a properly formatted email address.'] },
      { value: 'jjjj@jj.dd', expectedErrors: [] },
      {
        value: 'k000.ddd.dd',
        expectedErrors: ['Should be a properly formatted email address.'],
      },
      {
        value: '  dd@dd.ff   ',
        expectedErrors: ['Should be a properly formatted email address.'],
      },
    ];
    testData.forEach(({ value, expectedErrors }) => {
      const errors = RegistrationValidator.validateField(value, 'email');
      expect(errors).toEqual(expectedErrors);
    });
  });

  it('validates password field', () => {
    const errors = RegistrationValidator.validateField('wedsa', 'password');
    expect(errors).toContain('Password should contain minimum 8 characters');
    expect(errors).toContain('Should contain at least 1 uppercase and lowercase letter');
    expect(errors).toContain('Should contain at least 1 number');
    const validData = RegistrationValidator.validateField('sdfshKKK2221', 'password');
    expect(validData).toEqual([]);
  });

  it('validates date field', () => {
    const errors = RegistrationValidator.validateField('2015-05-07', 'date');
    expect(errors).toContain('Age should be > 13');
    const validAge = RegistrationValidator.validateField('2002-05-07', 'date');
    expect(validAge).toEqual([]);
  });
});

describe('RegistrationValidator address fields', () => {
  it('validates city field', () => {
    const errors = RegistrationValidator.validateField('', 'city');
    expect(errors).toContain('Must contain only letters A-Z and no special characters or numbers');
    const validCity = RegistrationValidator.validateField('London', 'city');
    expect(validCity).toEqual([]);
  });

  it('validates street field', () => {
    const errors = RegistrationValidator.validateField('', 'street');
    expect(errors).toContain('Must contain at least one character');
    const validStreet = RegistrationValidator.validateField('L', 'street');
    expect(validStreet).toEqual([]);
  });

  it('validates zipCode field for UK', () => {
    const errors = RegistrationValidator.validateField('HHH JJ', 'zipCode', 'UK');
    expect(errors).toContain(COUNTRIES_PATTERNS.UK.rule);
    const validUKPostalCode = RegistrationValidator.validateField('PO16 7GZ', 'zipCode', 'UK');
    expect(validUKPostalCode).toEqual([]);
  });

  it('validates zipCode field for France', () => {
    const errors = RegistrationValidator.validateField('ksdjfh', 'zipCode', 'France');
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
