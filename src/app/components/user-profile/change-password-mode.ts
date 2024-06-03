import Modal from '@components/modal/modal';
import notificationEmitter from '@components/notifications/notifications-controller';
import AuthService from '@services/auth-service';
import { updateCustomerPassword } from '@services/customer-service/my-customer-service';
import MyCustomer from '@services/customer-service/myCustomer';
import { showErrorMessages } from '@utils/errors-handling';

import { getChangePasswordRequest } from './edit-mode-adapters';
import { prepareMyCustomer, processPasswordData } from './profile-helpers';
import ChangePassword from './user-profile-view/edit-mode/change-password';
import type ProfileView from './user-profile-view/user-profile-view';

class ChangePasswordMode {
  constructor(
    private view: ProfileView,
    private logout: () => Promise<void>
  ) {}

  public enable() {
    const changePasswordForm = new ChangePassword();
    const modal = new Modal({ title: 'Change Password', content: changePasswordForm, parent: this.view.getNode() });
    modal.open();
    changePasswordForm.addListener('input', () => processPasswordData(changePasswordForm));
    changePasswordForm.confirmButton.addListener('click', async () => {
      const actualizeCustomer = await prepareMyCustomer(() => this.logout());
      if (!actualizeCustomer.isAuthorized) {
        modal.close();
      }
      if (processPasswordData(changePasswordForm).isValidForm && actualizeCustomer.isAuthorized) {
        changePasswordForm.confirmButton.getNode().disabled = true;
        const values = changePasswordForm.getValues();
        const changePasswordRequestBody = getChangePasswordRequest(changePasswordForm.getValues());
        const changePasswordResponse = await updateCustomerPassword(AuthService.getRoot(), changePasswordRequestBody);
        if (changePasswordResponse.success) {
          await AuthService.logout();
          const res = await AuthService.login(MyCustomer.email, values.newPassword);
          if (res.success) {
            MyCustomer.setCustomer(res.customer);
            this.view.profileCredentials.updateView();
            notificationEmitter.showMessage({
              messageType: 'success',
              title: 'Password changed!',
              text: 'Your password was updated.',
            });
            modal.close();
          } else {
            showErrorMessages(res);
            changePasswordForm.confirmButton.getNode().disabled = false;
          }
        } else {
          showErrorMessages(changePasswordResponse);
          changePasswordForm.confirmButton.getNode().disabled = false;
        }
      }
    });
  }
}

export default ChangePasswordMode;
