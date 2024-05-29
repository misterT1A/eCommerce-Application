import Modal from '@components/modal/modal';
import AuthService from '@services/auth-service';
import { deleteAccount, updateMyCustomerInfo } from '@services/customer-service/my-customer-service';

import UserDelete from './user-profile-view/edit-mode/delete-account';
import type ProfileView from './user-profile-view/user-profile-view';

class DeleteAccount {
  constructor(private view: ProfileView) {}

  public enable(logout: () => Promise<void>) {
    const deleteAcc = new UserDelete();
    const modal = new Modal({ title: 'Are you sure?', content: deleteAcc });
    modal.open();
    deleteAcc.confirmButton.addListener('click', async () => {
      await updateMyCustomerInfo();
      const res = await deleteAccount(AuthService.getRoot());
      if (res.success) {
        modal.close();
        await logout();
      }
    });
  }
}

export default DeleteAccount;
