const REGISTRATION_VALIDATION_RULES = {
  firstName: [
    { rule: 'First name must contain letters A-Z and no special characters or numbers', pattern: /^[a-zA-Z-]+$/ },
    { rule: 'Should not exceed 50 characters in length.', pattern: /^.{0,50}$/ },
  ],
  lastName: [
    { rule: 'Last name must contain letters A-Z and no special characters or numbers', pattern: /^[a-zA-Z-]+$/ },
    { rule: 'Should not exceed 50 characters in length.', pattern: /^.{0,50}$/ },
  ],
  email: [
    { rule: 'Should be a properly formatted email address.', pattern: /^\s*[\w.-]+@([\w-]+\.)+[\w-]{2,4}\s*$/ },
    { rule: 'Should not contain whitespace', pattern: /^[^\s]+$/ },
    { rule: 'Should not exceed 100 characters in length.', pattern: /^.{0,100}$/ },
  ],
  password: [
    { rule: 'Password should contain minimum 8 characters', pattern: /.{8,}$/ },
    { rule: 'Should contain at least 1 uppercase and lowercase letter', pattern: /(?=.*[A-Z])(?=.*[a-z])/ },
    { rule: 'Should contain at least 1 number', pattern: /(?=.*\d)/ },
    { rule: 'Should not exceed 100 characters in length.', pattern: /^.{0,100}$/ },
  ],
  city: [
    { rule: 'Must contain only letters A-Z and no special characters or numbers', pattern: /^[a-zA-Z\s-]+$/ },
    { rule: 'Should not exceed 100 characters in length.', pattern: /^.{0,100}$/ },
  ],
  street: [
    { rule: 'Must contain at least one character', pattern: /.+/ },
    { rule: 'Should not exceed 100 characters in length.', pattern: /^.{0,100}$/ },
  ],
};

export default REGISTRATION_VALIDATION_RULES;
