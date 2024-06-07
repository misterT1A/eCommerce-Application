import Controller from '@components/controller';
import type HeaderController from '@components/header/header_controller';
import type Modal from '@components/modal/modal';
import notificationEmitter from '@components/notifications/notifications-controller';
import AuthService from '@services/auth-service';
import MyCustomer from '@services/customer-service/myCustomer';
import type Router from '@src/app/router/router';

import AddAddress from './addresses-add-mode';
import EditAddress from './addresses-edit-mode';
import ChangePasswordMode from './change-password-mode';
import DeleteAccount from './delete-account-mode';
import DeleteAddress from './delete-address-mode';
import EditMode from './edit-mode';
import EditModeProfile from './profile-details-edit-mode';
import type EditModeForm from './user-profile-view/edit-mode/edit-mode-view';
import ProfileView from './user-profile-view/user-profile-view';

class ProfileController extends Controller<ProfileView> {
  private profileInfoEdit: EditModeProfile;

  private addAddress: AddAddress;

  private editAddressMode: EditAddress;

  private deleteAddressMode: DeleteAddress;

  private changePasswordMode: ChangePasswordMode;

  private deleteAccountMode: DeleteAccount;

  private editMode: EditMode;

  constructor(
    private router: Router,
    private headerController: HeaderController
  ) {
    super(
      new ProfileView(
        router,
        (id: string) => this.deleteAddressMode.enable(id),
        (id: string) => this.editAddressMode.enable(id),
        (id: string, reset: boolean) => this.editAddressMode.setAddressAsDefault('Shipping', id, reset),
        (id: string, reset: boolean) => this.editAddressMode.setAddressAsDefault('Billing', id, reset)
      )
    );

    this.setListeners();

    this.profileInfoEdit = new EditModeProfile(this.getView, this.headerController);
    this.addAddress = new AddAddress(this.getView);
    this.editAddressMode = new EditAddress(this.getView, () => this.logout());
    this.deleteAddressMode = new DeleteAddress(this.getView, () => this.logout());
    this.changePasswordMode = new ChangePasswordMode(this.getView, () => this.logout());
    this.deleteAccountMode = new DeleteAccount(this.getView);
    this.editMode = new EditMode(
      this.getView,
      () => this.logout(),
      this.headerController,
      (modal?: Modal<EditModeForm>) => this.deleteAccountMode.enable(() => this.logout(), modal)
    );
    if (MyCustomer.version === 1) {
      notificationEmitter.showMessage({
        messageType: 'info',
        title: `Hi, ${MyCustomer.firstName ?? ''}!`,
        text: 'You can activate the edit mode ✏️ to manage all your profile details. You also have the option to modify your personal information and addresses on the account page itself.',
      });
    }
  }

  private setListeners() {
    this.getView.openFirstAddress();
    this.getView.profileCredentials.editButton.addListener('click', () =>
      this.profileInfoEdit.enable(() => this.logout())
    );
    this.getView.profileAddresses.addAddressButton.addListener('click', () =>
      this.addAddress.enable(() => this.logout())
    );
    this.getView.buttonEdit.addListener('click', () => this.editMode.enable());
    this.getView.changePasswordButton.addListener('click', () => this.changePasswordMode.enable());
    this.getView.logOutButton.addListener('click', () => this.logout());
    this.getView.profileAddresses.billingAddressToggler.addListener('click', () =>
      this.getView.openAddress(MyCustomer.addresses.defaultBillingAddress ?? '')
    );
    this.getView.profileAddresses.shippingAddressToggler.addListener('click', () =>
      this.getView.openAddress(MyCustomer.addresses.defaultShippingAddress ?? '')
    );
  }

  private async logout() {
    await AuthService.logout();
    this.headerController.getView.changeTextNotLoginned();
    this.router.navigateToLastPoint();
  }
}

export default ProfileController;
