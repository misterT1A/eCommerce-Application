const REGISTRATION_VALIDATION_RULES = {
  firstName: [
    { rule: 'Name must contain at least one character and no special characters or numbers', pattern: /^[a-zA-Z]+$/ },
  ],
  lastName: [
    { rule: 'Name must contain at least one character and no special characters or numbers', pattern: /^[a-zA-Z]+$/ },
  ],
  email: [{ rule: 'Should be a properly formatted email address.', pattern: /^\S+@\S+\.\S+$/ }],
  password: [
    { rule: 'Minimum 8 characters', pattern: /.{8,}$/ },
    { rule: 'Should contain at least 1 uppercase letter', pattern: /(?=.*[A-Z])/ },
    { rule: 'Should contain at least 1 lowercase letter', pattern: /(?=.*[a-z])/ },
    { rule: 'Should contain at least 1 number', pattern: /(?=.*\d)/ },
  ],
  city: [{ rule: 'Must contain at least one character and no special characters or numbers', pattern: /^[a-zA-Z]+$/ }],
  street: [{ rule: 'Must contain at least one character', pattern: /.+/ }],
};

export default REGISTRATION_VALIDATION_RULES;
