import type {
  ByProjectKeyRequestBuilder,
  CustomerChangePassword,
  CustomerUpdateAction,
} from '@commercetools/platform-sdk';

import AuthService from '@services/auth-service';
import MyCustomer from '@services/customer-service/myCustomer';
import { processErrorResponse } from '@utils/errors-handling';

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
  id: string,
  root: ByProjectKeyRequestBuilder,
  data: { version: number; actions: CustomerUpdateAction[] }
): Promise<ILoginResult> {
  try {
    const customerUpdateResult = await root.customers().withId({ ID: id }).post({ body: data }).execute();
    return {
      success: true,
      customer: customerUpdateResult.body,
      message: 'User data is updated!',
    };
  } catch (error) {
    return processErrorResponse(error);
  }
}

export async function updateCustomerPassword(root: ByProjectKeyRequestBuilder, data: CustomerChangePassword) {
  try {
    const customerUpdateResult = await root.customers().password().post({ body: data }).execute();
    return {
      success: true,
      customer: customerUpdateResult.body,
      message: 'Password updated!',
    };
  } catch (error) {
    return processErrorResponse(error);
  }
}

export async function deleteAccount(root: ByProjectKeyRequestBuilder) {
  try {
    const deleteAccountResponse = await root
      .me()
      .delete({
        queryArgs: {
          version: MyCustomer.version ?? 1,
        },
      })
      .execute();
    return {
      success: true,
      customer: deleteAccountResponse.body,
      message: 'Account deleted',
    };
  } catch (error) {
    return processErrorResponse(error);
  }
}
