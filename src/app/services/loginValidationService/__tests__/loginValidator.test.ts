import LoginValidator from '@services/loginValidationService/loginValidator';

describe('LoginValidator validates login form fields', () => {
  it('validates email field', () => {
    const testData: { value: string; expectedErrors: string[] }[] = [
      { value: 'test', expectedErrors: ['Email address must be properly formatted (e.g., user@example.com)'] },
      {
        value: 'user@example.com ',
        expectedErrors: ['Email address must not contain leading or trailing whitespace'],
      },
    ];

    testData.forEach(({ value, expectedErrors }) => {
      const formValidatorResult = LoginValidator.validateEmail(value);
      expect(formValidatorResult.errors).toEqual(expectedErrors);
    });
  });

  it('validates password field', () => {
    const testData: { value: string; expectedErrors: string[] }[] = [
      { value: '1234Qwe', expectedErrors: ['Password must be at least 8 characters long'] },
      {
        value: '1234qwer',
        expectedErrors: ['Password must contain at least one uppercase letter'],
      },
      {
        value: '1234QWER',
        expectedErrors: ['Password must contain at least one lowercase letter'],
      },
      {
        value: 'Asssqwer',
        expectedErrors: ['Password must contain at least one digit'],
      },
      {
        value: '1234Qwer ',
        expectedErrors: ['Password must not contain leading or trailing whitespace'],
      },
    ];

    testData.forEach(({ value, expectedErrors }) => {
      const formValidatorResult = LoginValidator.validatePassword(value);
      expect(formValidatorResult.errors).toEqual(expectedErrors);
    });
  });
});
