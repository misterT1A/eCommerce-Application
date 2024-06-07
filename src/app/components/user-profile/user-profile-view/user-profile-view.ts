import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { button, div, h2, svg } from '@utils/elements';

import styles from './_user-profile.scss';
import CredentialsView from './credentials-view';
import ProfileAddressesView from './profile-addresses-view';

class ProfileView extends BaseComponent<HTMLElement> {
  public profileCredentials: CredentialsView;

  public profileAddresses: ProfileAddressesView;

  public changePasswordButton: BaseComponent<HTMLButtonElement>;

  public logOutButton: BaseComponent<HTMLButtonElement>;

  public buttonEdit: BaseComponent<HTMLButtonElement>;

  constructor(
    router: Router,
    deleteCallback: (id: string) => void,
    editCallback: (id: string) => void,
    setAsDefaultShipping: (id: string, reset: boolean) => Promise<void>,
    setAsDefaultBilling: (id: string, reset: boolean) => Promise<void>
  ) {
    super({ tag: 'div', className: styles.profile }, h2([styles.profile__title], 'My Account'));
    this.buttonEdit = button([styles.profile__editButton], '');
    this.buttonEdit.append(svg('/assets/img/pen-solid.svg#icon', styles.profile__editModeCardIcon));
    this.profileCredentials = new CredentialsView();
    this.profileAddresses = new ProfileAddressesView(
      deleteCallback,
      editCallback,
      setAsDefaultShipping,
      setAsDefaultBilling
    );
    this.appendChildren([this.profileAddresses, this.profileCredentials, this.buttonEdit]);
    this.changePasswordButton = button([styles.profile__button], 'CHANGE PASSWORD');
    this.logOutButton = button([styles.profile__button], 'LOG OUT');
    this.append(div([styles.profile__footer], this.changePasswordButton, this.logOutButton));
  }

  public openAddress(id: string) {
    this.profileAddresses.openAddress(id);
  }

  public openFirstAddress() {
    this.profileAddresses.openFirstAddress();
  }
}

export default ProfileView;
