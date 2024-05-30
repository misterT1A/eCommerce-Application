import Modal from '@components/modal/modal';
import AuthService from '@services/auth-service';
import { deleteAccount } from '@services/customer-service/my-customer-service';

import { prepareMyCustomer } from './profile-helpers';
import UserDelete from './user-profile-view/edit-mode/delete-account';
import type ProfileView from './user-profile-view/user-profile-view';

class DeleteAccount {
  constructor(private view: ProfileView) {}

  public enable(logout: () => Promise<void>) {
    const deleteAcc = new UserDelete();
    const modal = new Modal({ title: 'Are you sure?', content: deleteAcc });
    modal.open();
    deleteAcc.confirmButton.addListener('click', async () => {
      deleteAcc.confirmButton.getNode().disabled = true;
      const actualizeCustomer = await prepareMyCustomer(() => logout());
      if (!actualizeCustomer.isAuthorized) {
        modal.close();
        return;
      }
      const res = await deleteAccount(AuthService.getRoot());
      if (res.success) {
        await logout();
        modal.close();
      } else {
        deleteAcc.confirmButton.getNode().disabled = false;
      }
    });
  }
}

export default DeleteAccount;
