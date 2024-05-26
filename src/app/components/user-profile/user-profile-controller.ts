import Controller from '@components/controller';
import Modal from '@components/modal/modal';
import MyCustomer from '@services/customer-service/myCustomer';
import RegistrationValidator from '@services/registrationValidationService/registrationValidator';
import type Router from '@src/app/router/router';

import UserInfoEdit from './user-profile-view/edit-mode/edit-user';
import ProfileView from './user-profile-view/user-profile-view';

class ProfileController extends Controller<ProfileView> {
  private currentAddress = MyCustomer.addresses.addresses[0].id;

  constructor(private router: Router) {
    super(
      new ProfileView(
        router,
        (id) => this.deleteAddress(id),
        (id) => this.editAddress(id)
      )
    );
    this.getView.openAddress(this.currentAddress ?? '');
  }

  private deleteAddress(id: string) {
    console.log('delete', id);
  }

  private editAddress(id: string) {
    console.log('edit', id);
  }

  private enableUserInfoEdit() {
    const editForm = new UserInfoEdit();
    const userInfoEditModal = new Modal({ title: 'EDIT PROFILE INFO', content: editForm });
    userInfoEditModal.open();
    editForm.applyButton.addListener('click', () => this.processUserData(editForm));
  }

  private getInvalidFields(userData: IUserInfoData) {
    const invalidFields = new Map();
    Object.entries(RegistrationValidator.processUserInfo(userData)).forEach(([key, errors]) => {
      if (errors.length > 0) {
        invalidFields.set(key, errors);
      }
    });
  }

  private processUserData(form: UserInfoEdit) {
    let isValidForm = true;
    const errorsObject = RegistrationValidator.processUserInfo(form.getValues());
    Object.entries(errorsObject).forEach(([key, errors]) => {
      if (errors.length > 0) {
        isValidForm = false;
      }
      form.fields[key as 'firstName' | 'lastName' | 'email' | 'date'].updateErrors(errors);
    });
    if (isValidForm) {
      // submit form
    }
  }
}

export default ProfileController;
