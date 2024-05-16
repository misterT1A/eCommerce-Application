import type { ClientResponse } from '@commercetools/platform-sdk';
import type { ErrorResponse } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/error';

import { isTypeOf } from './asserts-object';

const errorResponseTemplate = {
  statusCode: 400,
  message: 'string',
  errors: ['string'],
};

export function assertIsErrorResponse(value: unknown): asserts value is ErrorResponse {
  if (!isTypeOf(value, errorResponseTemplate)) {
    throw new Error('Invalid data shape. ErrorResponse should contain "statusCode" and "message" fields');
  }
}

const RegistrationErrorsMap = new Map([
  ['DuplicateField', 'An account with this email address already exists. Please log in or use another email address.'],
]);

/**
 * Retrieves error messages from an ErrorResponse object.
 *
 * @param {ErrorResponse} errorResp - The error response object
 * @returns {string[]} - Array of error messages
 */
export function getErrorsMessages(errorResp: ErrorResponse): string[] {
  if (!errorResp.errors) {
    return [errorResp.message];
  }
  return errorResp.errors.map((error) => RegistrationErrorsMap.get(error.code) ?? error.message);
}

/**
 * Processes an error response, displaying error messages if the response status code is 400.
 *
 * @param {unknown} error - The error to process
 */
export function processErrorResponse(error: unknown) {
  const errorResponse = (error as ClientResponse).body;
  console.log(errorResponse);
  try {
    assertIsErrorResponse(errorResponse);
    if ((error as ClientResponse).statusCode === 400) {
      return {
        success: false,
        message: `Error`,
        errors: getErrorsMessages(errorResponse as ErrorResponse),
      };
    }
    return {
      success: false,
      message: `Unexpected error: ${errorResponse.message}`,
      errors: [`${errorResponse.message}`],
    };
  } catch (e: unknown | Error) {
    return {
      success: false,
      message: `Unexpected error: ${e}`,
    };
  }
}
