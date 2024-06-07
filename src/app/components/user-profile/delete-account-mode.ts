import Modal from '@components/modal/modal';
import notificationEmitter from '@components/notifications/notifications-controller';
import AuthService from '@services/auth-service';
import { deleteAccount } from '@services/customer-service/my-customer-service';

import { prepareMyCustomer } from './profile-helpers';
import UserDelete from './user-profile-view/edit-mode/delete-account';
import type EditModeForm from './user-profile-view/edit-mode/edit-mode-view';
import type ProfileView from './user-profile-view/user-profile-view';

class DeleteAccount {
  constructor(private view: ProfileView) {}

  public enable(logout: () => Promise<void>, modalEditMode?: Modal<EditModeForm>) {
    const deleteAcc = new UserDelete();
    const modal = new Modal({ title: 'Are you sure?', content: deleteAcc, parent: this.view.getNode() });
    modal.open();
    deleteAcc.confirmButton.addListener('click', async () => {
      deleteAcc.confirmButton.getNode().disabled = true;
      const actualizeCustomer = await prepareMyCustomer(() => logout());
      if (!actualizeCustomer.isAuthorized) {
        modal.close();
        modalEditMode?.close();
        return;
      }
      const res = await deleteAccount(AuthService.getRoot());
      if (res.success) {
        await logout();
        modal.close();
        notificationEmitter.showMessage({
          messageType: 'warning',
          title: 'Account was deleted!',
          text: `If you have an existing account, please log in to access your profile. If you don't have an account, you can create a new one.`,
        });
        modalEditMode?.close();
      } else {
        deleteAcc.confirmButton.getNode().disabled = false;
      }
    });
  }
}

export default DeleteAccount;
