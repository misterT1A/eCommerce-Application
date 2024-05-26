import Controller from '@components/controller';
import MyCustomer from '@services/customer-service/myCustomer';
import type Router from '@src/app/router/router';

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
}

export default ProfileController;
