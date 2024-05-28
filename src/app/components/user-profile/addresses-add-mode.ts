import type { Address } from '@commercetools/platform-sdk';

import FormField from '@components/form-ui-elements/formField';
import Modal from '@components/modal/modal';
import notificationEmitter from '@components/notifications/notifications-controller';
import AuthService from '@services/auth-service';
import { updateCustomer } from '@services/customer-service/my-customer-service';
import MyCustomer from '@services/customer-service/myCustomer';
import RegistrationValidator from '@services/registrationValidationService/registrationValidator';

import { getAddressAddRequest, getAddressTypeRequest } from './edit-mode-adapters';
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
    const addressID: Address = addresses ? addresses[addresses.length - 1] : '';
    if (values.isBilling || values.isShipping || values.isDefault) {
      const request = getAddressTypeRequest({
        id: addressID.id ?? '',
        isBilling: values.isBilling,
        isShipping: values.isShipping,
        isDefault: values.isDefault,
      });
      if (!request.actions.length) {
        return;
      }
      const resSetAttrs = await updateCustomer(MyCustomer.id ?? '', AuthService.getRoot(), request);
      if (resSetAttrs.success) {
        MyCustomer.setCustomer(resSetAttrs.customer);
        this.view.profileAddresses.updateView();
        this.view.openAddress(addressID.id ?? '');
        userInfoEditModal.close();
        notificationEmitter.showMessage({ messageType: 'success', text: 'Address is added!' });
      } else {
        const errors = resSetAttrs.errors ? resSetAttrs.errors : [resSetAttrs.message];
        errors.forEach((text) => notificationEmitter.showMessage({ messageType: 'error', text }));
      }
    } else {
      this.view.profileAddresses.updateView();
      this.view.openAddress(addressID.id ?? '');
      userInfoEditModal.close();
    }
  }

  public enable() {
    const addressForm = new UserAddressEdit();
    const userInfoEditModal = new Modal({ title: 'Add Address', content: addressForm });
    userInfoEditModal.open();
    addressForm.applyButton.setTextContent('ADD ADDRESS');
    addressForm.applyButton.addListener('click', async () => {
      if (this.processData(addressForm).isValidForm) {
        const values = addressForm.getValues();
        const requestBody = getAddressAddRequest(values);
        if (!requestBody.actions.length) {
          return;
        }
        const resAddAddress = await updateCustomer(MyCustomer.id ?? '', AuthService.getRoot(), requestBody);
        if (resAddAddress.success) {
          this.setAddressAttributes(resAddAddress, values, userInfoEditModal);
        }
      }
    });
    addressForm.addListener('input', () => this.processData(addressForm));
  }

  private processData(form: UserAddressEdit) {
    let isValidForm = true;
    const errorsObject = RegistrationValidator.processAddressInfo(form.getValues());
    Object.entries(errorsObject).forEach(([key, errors]) => {
      if (errors.length > 0) {
        isValidForm = false;
      }
      const field = form.fields[key as ProfileAddressesFieldsType];
      if (field instanceof FormField) {
        field.updateErrors(errors);
      }
    });
    return {
      isValidForm,
    };
  }
}

export default AddAddress;
