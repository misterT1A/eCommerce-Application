export const COUNTRIES_PATTERNS = {
  UK: {
    rule: 'Postal code for GB should be in format A(A)N(A/N)NAA (A[A]N[A/N] NAA).',
    code: 'GB',
    pattern: /^[A-Z]{1,2}[0-9R][0-9A-Z]?\\s*[0-9][A-Z-[CIKMOV]]{2}$/,
  },
  France: {
    rule: 'Postal code in France should be in format NN NNN or NNNNN',
    code: 'FR',
    pattern: /^\d{2}[ ]?\d{3}$/,
  },
  Belgium: { rule: 'Postal code in Belgium should be in format NNNN', code: 'BE', pattern: /^\d{4}$/ },
} as const;

export const VALID_COUNTRIES = ['UK', 'France', 'Belgium'] as const;
