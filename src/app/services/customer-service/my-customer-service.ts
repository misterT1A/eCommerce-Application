import type { ByProjectKeyRequestBuilder, CustomerUpdateAction } from '@commercetools/platform-sdk';

import AuthService from '@services/auth-service';
import MyCustomer from '@services/customer-service/myCustomer';

export async function updateMyCustomerInfo(): Promise<void> {
  const root = AuthService.getRoot();
  if (AuthService.isAuthorized()) {
    const customerInfo = await root.me().get().execute();
    if (customerInfo) {
      MyCustomer.setCustomer(customerInfo.body);
    }
  }
}

export async function updateCustomer(
  root: ByProjectKeyRequestBuilder,
  data: { version: number; actions: CustomerUpdateAction[] }
) {
  const customerUpdateResult = await root.customers().withId({ ID: 'customer-id' }).post({ body: data }).execute();
  return customerUpdateResult;
}

export async function updateCustomerPassword(
  root: ByProjectKeyRequestBuilder,
  data: { version: number; actions: CustomerUpdateAction[] }
) {
  const customerUpdateResult = await root.customers().withId({ ID: 'customer-id' }).post({ body: data }).execute();
  return customerUpdateResult;
}
