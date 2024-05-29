import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { h2 } from '@utils/elements';

import styles from './_user-profile.scss';
import CredentialsView from './credentials-view';
import ProfileAddressesView from './profile-addresses-view';

class ProfileView extends BaseComponent<HTMLElement> {
  public profileCredentials: CredentialsView;

  public profileAddresses: ProfileAddressesView;

  constructor(
    private router: Router,
    private deleteCallback: (id: string) => void,
    private editCallback: (id: string) => void,
    private setAsDefaultShipping: (id: string) => Promise<void>,

    private setAsDefaultBilling: (id: string) => Promise<void>
  ) {
    super({ tag: 'div', className: styles.profile }, h2([styles.profile__title], 'My Account'));
    this.profileCredentials = new CredentialsView();
    this.profileAddresses = new ProfileAddressesView(
      deleteCallback,
      editCallback,
      setAsDefaultShipping,
      setAsDefaultBilling
    );
    this.appendChildren([this.profileAddresses, this.profileCredentials]);
  }

  public openAddress(id: string) {
    this.profileAddresses.openAddress(id);
  }

  public openFirstAddress() {
    this.profileAddresses.openFirstAddress();
  }
}

export default ProfileView;
