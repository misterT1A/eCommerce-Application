import Modal from '@components/modal/modal';
import notificationEmitter from '@components/notifications/notifications-controller';
import AuthService from '@services/auth-service';
import { updateCustomer } from '@services/customer-service/my-customer-service';
import MyCustomer from '@services/customer-service/myCustomer';
import { showErrorMessages } from '@utils/errors-handling';

import { getRemoveAddressRequest } from './edit-mode-adapters';
import { prepareMyCustomer } from './profile-helpers';
import UserAddressDelete from './user-profile-view/edit-mode/delete-address';
import type ProfileView from './user-profile-view/user-profile-view';

class DeleteAddress {
  constructor(
    private view: ProfileView,
    private logout: () => Promise<void>
  ) {}

  public enable(id: string) {
    const deleteAddress = new UserAddressDelete(id);
    const modal = new Modal({ title: 'Are you sure?', content: deleteAddress });
    modal.open();
    deleteAddress.confirmButton.addListener('click', async () => {
      const actualizeCustomer = await prepareMyCustomer(() => this.logout());
      if (!actualizeCustomer.isAuthorized) {
        modal.close();
        return;
      }
      const requestBody = getRemoveAddressRequest(id);
      deleteAddress.confirmButton.getNode().disabled = true;
      const resRemoveAddress = await updateCustomer(MyCustomer.id ?? '', AuthService.getRoot(), requestBody);
      if (resRemoveAddress.success) {
        MyCustomer.setCustomer(resRemoveAddress.customer);
        this.view.profileAddresses.updateView();
        notificationEmitter.showMessage({
          messageType: 'success',
          text: `An address with id ${id} has been successfully removed from your profile.`,
        });
        this.view.profileAddresses.removeAddress(id);
        this.view.openFirstAddress();
        modal.close();
      } else {
        showErrorMessages(resRemoveAddress);
        deleteAddress.confirmButton.getNode().disabled = false;
      }
    });
  }
}

export default DeleteAddress;
