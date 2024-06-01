import type { Address } from '@commercetools/platform-sdk';

import Modal from '@components/modal/modal';
import notificationEmitter from '@components/notifications/notifications-controller';
import AuthService from '@services/auth-service';
import { updateCustomer } from '@services/customer-service/my-customer-service';
import MyCustomer from '@services/customer-service/myCustomer';
import { showErrorMessages } from '@utils/errors-handling';

import { getAddressAddRequest, getAddressTypeRequest } from './edit-mode-adapters';
import { prepareMyCustomer, processAddressData } from './profile-helpers';
import UserAddressEdit from './user-profile-view/edit-mode/edit-address';
import type ProfileView from './user-profile-view/user-profile-view';

class AddAddress {
  constructor(private view: ProfileView) {}

  private async setAddressAttributes(
    resAddAddress: ILoginResult,
    values: ProfileAddressValues,
    userInfoEditModal: Modal<UserAddressEdit>
  ) {
    MyCustomer.setCustomer(resAddAddress.customer);
    const addresses = resAddAddress.customer?.addresses;
    const address: Address = addresses ? addresses[addresses.length - 1] : '';
    if (values.isBilling || values.isShipping || values.isDefaultBilling || values.isDefaultShipping) {
      const { isBilling, isShipping, isDefaultBilling, isDefaultShipping } = values;
      const request = getAddressTypeRequest({
        id: address.id ?? '',
        isBilling,
        isShipping,
        isDefaultBilling,
        isDefaultShipping,
      });
      if (!request.actions.length) {
        return;
      }
      const resSetAttrs = await updateCustomer(MyCustomer.id ?? '', AuthService.getRoot(), request);
      if (resSetAttrs.success) {
        MyCustomer.setCustomer(resSetAttrs.customer);
        this.view.profileAddresses.updateView();
        this.view.openAddress(address.id ?? '');
        userInfoEditModal.close();
        notificationEmitter.showMessage({ messageType: 'success', text: 'Address is added!' });
      } else {
        showErrorMessages(resAddAddress);
      }
    } else {
      this.view.profileAddresses.updateView();
      this.view.openAddress(address.id ?? '');
      userInfoEditModal.close();
    }
  }

  public enable(logout: () => Promise<void>) {
    const addressForm = new UserAddressEdit();
    const modal = new Modal({ title: 'Add Address', content: addressForm });
    modal.open();
    addressForm.applyButton.setTextContent('ADD ADDRESS');
    addressForm.applyButton.addListener('click', async () => {
      const actualizeCustomer = await prepareMyCustomer(() => logout());
      if (!actualizeCustomer.isAuthorized) {
        modal.close();
        return;
      }
      if (processAddressData(addressForm).isValidForm) {
        const values = addressForm.getValues();
        const requestBody = getAddressAddRequest(values);
        if (!requestBody.actions.length) {
          return;
        }
        const resAddAddress = await updateCustomer(MyCustomer.id ?? '', AuthService.getRoot(), requestBody);
        if (resAddAddress.success) {
          this.setAddressAttributes(resAddAddress, values, modal);
        } else {
          showErrorMessages(resAddAddress);
        }
      }
    });
    addressForm.addListener('input', () => processAddressData(addressForm));
  }
}

export default AddAddress;
