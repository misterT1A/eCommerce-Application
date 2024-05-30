import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { button, div, h2 } from '@utils/elements';

import styles from './_user-profile.scss';
import CredentialsView from './credentials-view';
import ProfileAddressesView from './profile-addresses-view';

class ProfileView extends BaseComponent<HTMLElement> {
  public profileCredentials: CredentialsView;

  public profileAddresses: ProfileAddressesView;

  public changePasswordButton: BaseComponent<HTMLButtonElement>;

  public logOutButton: BaseComponent<HTMLButtonElement>;

  public deleteAccount: BaseComponent<HTMLButtonElement>;

  constructor(
    router: Router,
    deleteCallback: (id: string) => void,
    editCallback: (id: string) => void,
    setAsDefaultShipping: (id: string) => Promise<void>,

    setAsDefaultBilling: (id: string) => Promise<void>
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
    this.changePasswordButton = button([styles.profile__button], 'CHANGE PASSWORD');
    this.logOutButton = button([styles.profile__button], 'LOG OUT');
    this.deleteAccount = button([styles.profile__button], 'DELETE ACCOUNT');
    this.append(div([styles.profile__footer], this.changePasswordButton, this.logOutButton, this.deleteAccount));
  }

  public openAddress(id: string) {
    this.profileAddresses.openAddress(id);
  }

  public openFirstAddress() {
    this.profileAddresses.openFirstAddress();
  }
}

export default ProfileView;
