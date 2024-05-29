import Controller from '@components/controller';
import type HeaderController from '@components/header/header_controller';
import AuthService from '@services/auth-service';
import type Router from '@src/app/router/router';

import AddAddress from './addresses-add-mode';
import EditAddress from './addresses-edit-mode';
import ChangePasswordMode from './change-password-mode';
import DeleteAccount from './delete-account-mode';
import DeleteAddress from './delete-address-mode';
import EditModeProfile from './profile-details-edit-mode';
import ProfileView from './user-profile-view/user-profile-view';

class ProfileController extends Controller<ProfileView> {
  private profileInfoEdit: EditModeProfile;

  private addAddress: AddAddress;

  private editAddressMode: EditAddress;

  private deleteAddressMode: DeleteAddress;

  private changePasswordMode: ChangePasswordMode;

  private deleteAccountMode: DeleteAccount;

  constructor(
    private router: Router,
    private headerController: HeaderController
  ) {
    super(
      new ProfileView(
        router,
        (id) => this.deleteAddressMode.enable(id),
        (id) => this.editAddressMode.enable(id),
        (id) => this.editAddressMode.setAddressAsDefault('Shipping', id),
        (id) => this.editAddressMode.setAddressAsDefault('Billing', id)
      )
    );
    this.getView.openFirstAddress();
    this.getView.profileCredentials.editButton.addListener('click', () => this.profileInfoEdit.enable());
    this.getView.profileAddresses.addAddressButton.addListener('click', () => this.addAddress.enable());
    this.getView.changePasswordButton.addListener('click', () => this.changePasswordMode.enable());
    this.getView.deleteAccount.addListener('click', () => this.deleteAccountMode.enable(() => this.logout()));
    this.getView.logOutButton.addListener('click', () => this.logout());
    this.profileInfoEdit = new EditModeProfile(this.getView, this.headerController);
    this.addAddress = new AddAddress(this.getView);
    this.editAddressMode = new EditAddress(this.getView);
    this.deleteAddressMode = new DeleteAddress(this.getView);
    this.changePasswordMode = new ChangePasswordMode(this.getView);
    this.deleteAccountMode = new DeleteAccount(this.getView);
  }

  private async logout() {
    await AuthService.logout();
    this.headerController.getView.changeTextNotLoginned();
    this.router.navigateToLastPoint();
  }
}

export default ProfileController;
