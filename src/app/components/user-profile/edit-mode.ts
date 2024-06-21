import type { CustomerUpdateAction } from '@commercetools/platform-sdk';

import type HeaderController from '@components/header/header_controller';
import Modal from '@components/modal/modal';
import notificationEmitter from '@components/notifications/notifications-controller';
import AuthService from '@services/auth-service';
import { updateCustomer } from '@services/customer-service/my-customer-service';
import MyCustomer from '@services/customer-service/myCustomer';
import { showErrorMessages } from '@utils/errors-handling';

import { getAddressEditRequest, getAddressTypeRequest, getUserInfoUpdateRequest } from './edit-mode-adapters';
import { getCountryName, prepareMyCustomer, processAddressData, processUserData } from './profile-helpers';
import UserAddressEdit from './user-profile-view/edit-mode/edit-address';
import EditModeForm from './user-profile-view/edit-mode/edit-mode-view';
import type ProfileView from './user-profile-view/user-profile-view';

class EditMode {
  private addresses: Map<string, ProfileAddressValues> = new Map();

  private editView: EditModeForm | null = null;

  constructor(
    private view: ProfileView,
    private logout: () => Promise<void>,
    private headerController: HeaderController,
    private deleteAccount: (modal?: Modal<EditModeForm>) => void
  ) {}

  public enable() {
    this.editView = new EditModeForm((id: string) => {
      const values = this.addresses.get(id);
      if (values) {
        this.openAddressModal(id, values);
      }
    });
    this.addresses = new Map();
    MyCustomer.addresses.addresses.forEach((address) => {
      this.addresses.set(address.id ?? '', {
        city: address?.city ?? '',
        street: address?.streetName ?? '',
        country: (getCountryName(address?.country ?? '') ?? '') as CountryType,
        zipCode: address?.postalCode ?? '',
        ...MyCustomer.getAddressType(address.id ?? ''),
      });
    });
    const modal = new Modal({
      title: 'Edit Account Details',
      content: this.editView,
      wide: true,
      parent: this.view.getNode(),
    });
    modal.open();
    this.editView.deleteAccount.addListener('click', () => {
      this.deleteAccount(modal);
    });
    this.editView.addListener('input', () => {
      if (!this.editView) {
        return;
      }
      processUserData(this.editView.editUserInfo);
    });
    this.editView.saveButton.addListener('click', async () => {
      if (!this.editView) {
        return;
      }
      const actualizeCustomer = await prepareMyCustomer(() => this.logout());
      if (!actualizeCustomer.isAuthorized) {
        modal.close();
      }
      if (processUserData(this.editView.editUserInfo).isValidForm && actualizeCustomer.isAuthorized) {
        await this.sendRequest();
      }
    });
    this.editView.drawCards(this.addresses);
  }

  private async sendRequest() {
    if (!this.editView) {
      return;
    }
    this.editView.saveButton.getNode().disabled = true;
    const userActions = getUserInfoUpdateRequest(this.editView.editUserInfo.getValues()).actions;
    const addressActions: CustomerUpdateAction[] = [];
    this.addresses.forEach((address, id) => {
      addressActions.push(...getAddressEditRequest(address, id).actions);
      const { isBilling, isShipping, isDefaultBilling, isDefaultShipping } = address;
      addressActions.push(
        ...getAddressTypeRequest(
          { id, isBilling, isShipping, isDefaultBilling, isDefaultShipping },
          { id, ...MyCustomer.getAddressType(id) }
        ).actions
      );
    });
    const actions = [...userActions, ...addressActions];
    const res = await updateCustomer(MyCustomer.id ?? '', AuthService.getRoot(), {
      version: MyCustomer.version ?? 1,
      actions,
    });
    this.editView.saveButton.getNode().disabled = false;
    if (res.success) {
      MyCustomer.setCustomer(res.customer);
      this.view.profileAddresses.updateView();
      this.view.profileCredentials.updateView();
      this.view.openFirstAddress();
      notificationEmitter.showMessage({
        messageType: 'success',
        title: 'Saved',
        text: 'Your profile was updated!',
      });
      this.headerController.updateTextLoggined(MyCustomer.fullNameShort);
    } else {
      showErrorMessages(res);
    }
  }

  public openAddressModal(id: string, values: ProfileAddressValues) {
    const edit = new UserAddressEdit();
    const modal = new Modal({ title: 'Edit Address', content: edit, parent: this.editView?.getNode() });
    edit.applyButton.setTextContent('APPLY');
    edit.setValues(values);
    edit.applyButton.addListener('click', () => {
      const constFormValues = edit.getValues();
      if (processAddressData(edit).isValidForm) {
        this.addresses.forEach((address, key) => {
          const a = address;
          if (constFormValues.isDefaultBilling) {
            a.isDefaultBilling = false;
          }
          if (constFormValues.isDefaultShipping) {
            a.isDefaultShipping = false;
          }
          this.addresses.set(key, a);
        });
        this.addresses.set(id, constFormValues);
        this.addresses.forEach((address, addressId) => {
          const { isBilling, isShipping, isDefaultBilling, isDefaultShipping } = address;
          this.editView?.drawAddressCard(addressId, address, {
            isBilling,
            isShipping,
            isDefaultBilling,
            isDefaultShipping,
          });
        });
        modal.close();
      }
    });

    modal.open();
    edit.addListener('input', () => processAddressData(edit));
  }
}

export default EditMode;
