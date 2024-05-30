import Modal from '@components/modal/modal';
import notificationEmitter from '@components/notifications/notifications-controller';
import AuthService from '@services/auth-service';
import { updateCustomer } from '@services/customer-service/my-customer-service';
import MyCustomer from '@services/customer-service/myCustomer';
import { showErrorMessages } from '@utils/errors-handling';

import {
  getAddressEditRequest,
  getAddressTypeRequest,
  getAddressValuesById,
  getSetDefaultAddressRequest,
} from './edit-mode-adapters';
import { prepareMyCustomer, processAddressData } from './profile-helpers';
import UserAddressEdit from './user-profile-view/edit-mode/edit-address';
import type ProfileView from './user-profile-view/user-profile-view';

class EditAddress {
  constructor(
    private view: ProfileView,
    private logout: () => Promise<void>
  ) {}

  private async setAddressAttributes(id: string, values: ProfileAddressValues) {
    if (values.isBilling || values.isShipping || values.isDefaultBilling || values.isDefaultShipping) {
      const request = getAddressTypeRequest(
        {
          id: id ?? '',
          isBilling: values.isBilling,
          isShipping: values.isShipping,
          isDefaultBilling: values.isDefaultBilling,
          isDefaultShipping: values.isDefaultShipping,
        },
        {
          id: id ?? '',
          isBilling: MyCustomer.isBillingAddress(id),
          isShipping: MyCustomer.isShippingAddress(id),
          isDefaultBilling: MyCustomer.defaultBillingId === id,
          isDefaultShipping: MyCustomer.defaultShippingId === id,
        }
      );
      if (!request.actions.length) {
        return;
      }
      const resSetAttrs = await updateCustomer(MyCustomer.id ?? '', AuthService.getRoot(), request);
      if (resSetAttrs.success) {
        MyCustomer.setCustomer(resSetAttrs.customer);
        this.view.profileAddresses.updateView();
        this.view.openAddress(id ?? '');
      } else {
        showErrorMessages(resSetAttrs);
      }
    } else {
      this.view.profileAddresses.updateView();
      this.view.openAddress(id ?? '');
    }
  }

  public enable(id: string) {
    const addressForm = new UserAddressEdit();
    const userInfoEditModal = new Modal({ title: 'Edit Address', content: addressForm });
    userInfoEditModal.open();
    addressForm.setValues(getAddressValuesById(id));
    addressForm.applyButton.addListener('click', async () => {
      const actualizeCustomer = await prepareMyCustomer(() => this.logout());
      if (!actualizeCustomer.isAuthorized) {
        userInfoEditModal.close();
      }
      if (processAddressData(addressForm).isValidForm && actualizeCustomer.isAuthorized) {
        const values = addressForm.getValues();
        const requestBody = getAddressEditRequest(values, id);
        if (!requestBody.actions.length) {
          return;
        }
        const resUpdateAddress = await updateCustomer(MyCustomer.id ?? '', AuthService.getRoot(), requestBody);
        if (resUpdateAddress.success) {
          MyCustomer.setCustomer(resUpdateAddress.customer);
          this.view.profileAddresses.updateView();
          this.view.openAddress(id);
          await this.setAddressAttributes(id, values);
          notificationEmitter.showMessage({ messageType: 'success', title: 'Saved!', text: 'Address is updated!' });
        } else {
          showErrorMessages(resUpdateAddress);
        }
      }
    });
    addressForm.addListener('input', () => processAddressData(addressForm));
  }

  public async setAddressAsDefault(type: 'Shipping' | 'Billing', id: string) {
    const actualizeCustomer = await prepareMyCustomer(() => this.logout());
    if (!actualizeCustomer.isAuthorized) {
      return;
    }
    const request = getSetDefaultAddressRequest(type, id);
    if (!request.actions.length) {
      return;
    }
    const resSetAttrs = await updateCustomer(MyCustomer.id ?? '', AuthService.getRoot(), request);
    if (resSetAttrs.success) {
      MyCustomer.setCustomer(resSetAttrs.customer);
      this.view.profileAddresses.updateView();
      this.view.openAddress(id ?? '');
    } else {
      showErrorMessages(resSetAttrs);
    }
  }
}

export default EditAddress;
