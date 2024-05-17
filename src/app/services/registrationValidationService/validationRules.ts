const REGISTRATION_VALIDATION_RULES = {
  firstName: [
    { rule: 'First name must contain letters A-Z and no special characters or numbers', pattern: /^[a-zA-Z]+$/ },
  ],
  lastName: [
    { rule: 'Last name must contain letters A-Z and no special characters or numbers', pattern: /^[a-zA-Z]+$/ },
  ],
  email: [{ rule: 'Should be a properly formatted email address.', pattern: /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/ }],
  password: [
    { rule: 'Password should contain minimum 8 characters', pattern: /.{8,}$/ },
    { rule: 'Should contain at least 1 uppercase and lowercase letter', pattern: /(?=.*[A-Z])(?=.*[a-z])/ },
    { rule: 'Should contain at least 1 number', pattern: /(?=.*\d)/ },
  ],
  city: [{ rule: 'Must contain only letters A-Z and no special characters or numbers', pattern: /^[a-zA-Z]+$/ }],
  street: [{ rule: 'Must contain at least one character', pattern: /.+/ }],
};

export default REGISTRATION_VALIDATION_RULES;
