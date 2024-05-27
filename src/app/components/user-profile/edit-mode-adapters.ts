import type { CustomerUpdate, CustomerUpdateAction } from '@commercetools/platform-sdk';

import MyCustomer from '@services/customer-service/myCustomer';
import getUTCDate from '@utils/date-helpers';

export function getUserInfoUpdateRequest(values: IUserInfoValues): CustomerUpdate {
  const actions: CustomerUpdateAction[] = [];
  if (MyCustomer.email !== values.email) {
    actions.push({
      action: 'changeEmail',
      email: values.email,
    });
  }
  if (MyCustomer.firstName !== values.firstName) {
    actions.push({
      action: 'setFirstName',
      firstName: values.firstName,
    });
  }
  if (MyCustomer.lastName !== values.lastName) {
    actions.push({
      action: 'setLastName',
      lastName: values.lastName,
    });
  }
  const dateString = getUTCDate(new Date(values.date));
  if (MyCustomer.dateOfBirth !== dateString) {
    actions.push({
      action: 'setDateOfBirth',
      dateOfBirth: dateString,
    });
  }
  return {
    version: MyCustomer.version ?? 1,
    actions,
  };
}

export function getLogsFromRequestBody(customerUpdateRequest: CustomerUpdate) {
  const actions: string[] = [];
  customerUpdateRequest.actions.forEach((action) => {
    if (action.action === 'changeEmail') {
      actions.push('email');
    }
    if (action.action === 'setFirstName') {
      actions.push('first name');
    }
    if (action.action === 'setLastName') {
      actions.push('last name');
    }
    if (action.action === 'setDateOfBirth') {
      actions.push('date of birth');
    }
  });
  const changes = actions?.slice(1)?.join(', ') ?? '';
  if (actions.length > 1) {
    return `The ${changes} and ${actions[0]} are updated.`;
  }
  if (actions.length === 1) {
    return `The ${actions[0]} is updated.`;
  }
  return '';
}

export function getAddressesInfoUpdate() {
  //
}
