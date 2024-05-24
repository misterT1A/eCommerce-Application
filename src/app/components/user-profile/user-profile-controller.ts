import Controller from '@components/controller';
import type Router from '@src/app/router/router';

import ProfileView from './user-profile-view/user-profile-view';

class ProfileController extends Controller<ProfileView> {
  constructor(private router: Router) {
    super(new ProfileView(router));
  }
}

export default ProfileController;
