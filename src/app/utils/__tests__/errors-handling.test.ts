import type { ClientResponse, ErrorResponse } from '@commercetools/platform-sdk';

import {
  assertIsErrorResponse,
  getErrorsMessages,
  isClientResponse,
  isErrorResponse,
  processErrorResponse,
} from '../errors-handling';

describe('errorHandler module', () => {
  const validClientResponse: ClientResponse = {
    body: {
      statusCode: 400,
      message: 'Bad Request',
      errors: [{ code: 'DuplicateField', message: 'Field is duplicated', field: '', duplicateValue: '' }],
    },
    statusCode: 400,
  };

  const validErrorResponse: ErrorResponse = {
    statusCode: 400,
    message: 'Bad Request',
    errors: [{ code: 'DuplicateField', message: 'Field is duplicated', field: '', duplicateValue: '' }],
  };

  const invalidResponse = {
    body: {
      otherField: '',
    },
  };

  describe('isClientResponse', () => {
    it('Should return true for a valid ClientResponse', () => {
      expect(isClientResponse(validClientResponse)).toBe(true);
    });

    it('Should return false for an invalid ClientResponse', () => {
      expect(isClientResponse(invalidResponse)).toBe(false);
    });
  });

  describe('isErrorResponse', () => {
    it('Should return true for a valid ErrorResponse', () => {
      expect(isErrorResponse(validErrorResponse)).toBe(true);
    });

    it('Should return false for an invalid ErrorResponse', () => {
      console.debug(isErrorResponse(invalidResponse.body));
      expect(isErrorResponse(invalidResponse.body)).toBe(false);
    });
  });

  describe('assertIsErrorResponse', () => {
    it('Should not throw an error for a valid ErrorResponse', () => {
      expect(() => assertIsErrorResponse(validErrorResponse)).not.toThrow();
    });

    it('Should throw an error for an invalid ErrorResponse', () => {
      expect(() => assertIsErrorResponse(invalidResponse.body)).toThrow(Error);
    });
  });

  describe('getErrorsMessages', () => {
    it('Should return the correct error messages for a valid ErrorResponse', () => {
      const messages = getErrorsMessages(validErrorResponse);
      expect(messages).toEqual([
        'An account with this email address already exists. Please log in or use another email address.',
      ]);
    });

    it('Should return the default message if no errors are present', () => {
      const errorResponse: ErrorResponse = { statusCode: 400, message: 'General error' };
      const messages = getErrorsMessages(errorResponse);
      expect(messages).toEqual(['General error']);
    });
  });

  describe('processErrorResponse', () => {
    it('Should process a valid ClientResponse with status 400 correctly', () => {
      const result = processErrorResponse(validClientResponse);
      expect(result).toEqual({
        success: false,
        message: 'Error',
        errors: ['An account with this email address already exists. Please log in or use another email address.'],
      });
    });

    it('Should handle non-ClientResponse errors', () => {
      const error = new Error('Some other error');
      const result = processErrorResponse(error);
      expect(result).toEqual({
        success: false,
        message: `Unexpected error: ${error}`,
      });
    });
  });
});
