import type HeaderController from '@components/header/header_controller';
import Modal from '@components/modal/modal';
import notificationEmitter from '@components/notifications/notifications-controller';
import AuthService from '@services/auth-service';
import { updateCustomer, updateMyCustomerInfo } from '@services/customer-service/my-customer-service';
import MyCustomer from '@services/customer-service/myCustomer';
import RegistrationValidator from '@services/registrationValidationService/registrationValidator';

import { getUserInfoUpdateRequest } from './edit-mode-adapters';
import { getLogsFromRequestBody } from './profile-helpers';
import UserInfoEdit from './user-profile-view/edit-mode/edit-user';
import type ProfileView from './user-profile-view/user-profile-view';

class EditModeProfile {
  constructor(
    private view: ProfileView,
    private headerController: HeaderController
  ) {}

  public enable() {
    const editForm = new UserInfoEdit({
      firstName: MyCustomer.firstName ?? '',
      lastName: MyCustomer.lastName ?? '',
      date: MyCustomer.dateOfBirth ?? '',
      email: MyCustomer.email ?? '',
    });
    const userInfoEditModal = new Modal({ title: 'Profile Info', content: editForm });
    userInfoEditModal.open();
    editForm.applyButton.addListener('click', async () => {
      await updateMyCustomerInfo();
      if (this.processUserData(editForm).isValidForm) {
        const values = editForm.getValues();
        const requestBody = getUserInfoUpdateRequest(values);
        if (!requestBody.actions.length) {
          return;
        }
        editForm.applyButton.getNode().disabled = true;
        const res = await updateCustomer(MyCustomer.id ?? '', AuthService.getRoot(), requestBody);
        if (res.success) {
          MyCustomer.setCustomer(res.customer);
          this.view.profileCredentials.updateView();
          this.headerController.updateTextLoggined(MyCustomer.fullNameShort);
          notificationEmitter.showMessage({
            messageType: 'success',
            title: 'Changes are saved!',
            text: getLogsFromRequestBody(requestBody),
          });
        } else {
          const errors = res.errors ? res.errors : [res.message];
          errors.forEach((text) => notificationEmitter.showMessage({ messageType: 'error', text }));
        }
        editForm.applyButton.getNode().disabled = false;
      }
    });
    editForm.addListener('input', () => this.processUserData(editForm));
  }

  private processUserData(form: UserInfoEdit) {
    let isValidForm = true;
    const errorsObject = RegistrationValidator.processUserInfo(form.getValues());
    Object.entries(errorsObject).forEach(([key, errors]) => {
      if (errors.length > 0) {
        isValidForm = false;
      }
      form.fields[key as userFormFieldsType].updateErrors(errors);
    });
    return {
      isValidForm,
    };
  }
}

export default EditModeProfile;
