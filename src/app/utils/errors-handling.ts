import type { ClientResponse } from '@commercetools/platform-sdk';
import type { ErrorResponse } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/error';

import notificationEmitter from '@components/notifications/notifications-controller';

import { hasFields, isTypeOf } from './asserts-object';

const errorResponseTemplate = {
  statusCode: 400,
  message: 'string',
  errors: ['string'],
} as const;

const clientResponseTemplate = {
  body: {},
  statusCode: 400,
} as const;

export function isClientResponse(v: unknown): v is ClientResponse {
  return hasFields(v, clientResponseTemplate);
}

export function isErrorResponse(v: unknown): v is ErrorResponse {
  return isTypeOf(v, errorResponseTemplate);
}

export function assertIsErrorResponse(value: unknown): asserts value is ErrorResponse {
  if (!isTypeOf(value, errorResponseTemplate)) {
    throw new Error(`${value}`);
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
  if (!isClientResponse(error)) {
    return {
      success: false,
      message: `Unexpected error: ${error}`,
    };
  }
  const errorResponse: unknown = error.body;
  if (isErrorResponse(errorResponse)) {
    if ((error as ClientResponse).statusCode === 400) {
      return {
        success: false,
        message: `Error`,
        errors: getErrorsMessages(errorResponse),
      };
    }
  }
  return {
    success: false,
    message: `Unexpected error: ${error}`,
    errors: [`${error}`],
  };
}

export function showErrorMessages(res: ILoginResult) {
  const errors = res.errors ? res.errors : [res.message];
  errors.forEach((text) => notificationEmitter.showMessage({ messageType: 'error', text }));
}
