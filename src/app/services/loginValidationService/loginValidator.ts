export default class LoginValidator {
  public static validateEmail(email: string): IFormValidatorResult {
    const result: IFormValidatorResult = {
      success: true,
      errors: [],
    };

    const emailRegex = /^\s*[\w-.]+@([\w-]+\.)+[\w-]{2,4}\s*$/g;
    if (!emailRegex.test(email)) {
      result.errors.push('Email address must be properly formatted (e.g., user@example.com)');
    }

    if (email !== email.trim()) {
      result.errors.push('Email address must not contain leading or trailing whitespace');
    }

    result.success = result.errors.length < 1;
    return result;
  }

  public static validatePassword(password: string): IFormValidatorResult {
    const result: IFormValidatorResult = {
      success: true,
      errors: [],
    };
    if (password.length < 8) {
      result.errors.push('Password must be at least 8 characters long');
    }
    if (password.toLocaleLowerCase() === password) {
      result.errors.push('Password must contain at least one uppercase letter');
    }
    if (password.toUpperCase() === password) {
      result.errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
      result.errors.push('Password must contain at least one digit');
    }
    if (password !== password.trim()) {
      result.errors.push('Password must not contain leading or trailing whitespace');
    }

    result.success = result.errors.length < 1;
    return result;
  }
}
