import Controller from '@components/controller';
import type HeaderController from '@components/header/header_controller';
import MyCustomer from '@services/customer-service/myCustomer';
import type Router from '@src/app/router/router';

import AddAddress from './addresses-add-mode';
import EditModeProfile from './profile-details-edit-mode';
import ProfileView from './user-profile-view/user-profile-view';

class ProfileController extends Controller<ProfileView> {
  private currentAddress = MyCustomer.addresses.addresses[0].id;

  private profileInfoEdit: EditModeProfile;

  private addAddress: AddAddress;

  constructor(
    private router: Router,
    private headerController: HeaderController
  ) {
    super(
      new ProfileView(
        router,
        (id) => this.deleteAddress(id),
        (id) => this.editAddress(id)
      )
    );
    this.getView.openAddress(this.currentAddress ?? '');
    this.getView.profileCredentials.editButton.addListener('click', () => {
      this.enableUserInfoEdit();
    });
    this.getView.profileAddresses.addAddressButton.addListener('click', () => {
      this.enableAddressesAdd();
    });
    this.profileInfoEdit = new EditModeProfile(this.getView, this.headerController);
    this.addAddress = new AddAddress(this.getView);
  }

  private deleteAddress(id: string) {
    console.log('delete', id);
  }

  private editAddress(id: string) {
    console.log('edit', id);
  }

  private enableUserInfoEdit() {
    this.profileInfoEdit.enable();
  }

  private enableAddressesAdd() {
    this.addAddress.enable();
  }
}

export default ProfileController;
