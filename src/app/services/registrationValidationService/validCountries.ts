export const COUNTRIES_PATTERNS = {
  UK: {
    rule: 'Should be valid UK postal code.',
    code: 'GB',
    pattern: /^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/,
  },
  France: {
    rule: 'Postal code in France should be in format NN NNN or NNNNN',
    code: 'FR',
    pattern: /^\d{2}[ ]?\d{3}$/,
  },
  Belgium: { rule: 'Postal code in Belgium should be in format NNNN', code: 'BE', pattern: /^\d{4}$/ },
} as const;

export const VALID_COUNTRIES = ['UK', 'France', 'Belgium'] as const;
