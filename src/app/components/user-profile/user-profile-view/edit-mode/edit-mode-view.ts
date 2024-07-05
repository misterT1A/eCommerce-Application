import { generateAddressTags, getAddressFields } from '@components/user-profile/profile-helpers';
import MyCustomer from '@services/customer-service/myCustomer';
import BaseComponent from '@utils/base-component';
import { button, div, h2, svg } from '@utils/elements';

import UserInfoEdit from './edit-user';
import styles from '../_user-profile.scss';

class EditModeForm extends BaseComponent {
  private addressCards: Map<string, BaseComponent> = new Map();

  public editUserInfo: UserInfoEdit = new UserInfoEdit({
    firstName: MyCustomer.firstName ?? '',
    lastName: MyCustomer.lastName ?? '',
    date: MyCustomer.dateOfBirth ?? '',
    email: MyCustomer.email ?? '',
  });

  public addressesWrapper: BaseComponent<HTMLElement>;

  public saveButton: BaseComponent<HTMLButtonElement>;

  public deleteAccount: BaseComponent<HTMLButtonElement>;

  constructor(private openEditModal: (id: string) => void) {
    super({ tag: 'div', className: styles.profile__editMode });
    const personalInfoSection = div([styles.profile__editModePersonalInfoSection], this.editUserInfo);
    this.addressesWrapper = div([styles.profile__editModeAddressesWrapper]);
    const addressesSection = div(
      [styles.profile__editModeAddressesSection],
      h2([styles.profile__addressCardTitle], 'MY ADDRESSES'),
      this.addressesWrapper
    );
    this.saveButton = button([styles.profile__button], 'SAVE');
    this.deleteAccount = button([styles.profile__button], 'DELETE ACCOUNT');
    this.appendChildren([
      personalInfoSection,
      addressesSection,
      div([styles.profile__editButtonsWrapper], this.saveButton, this.deleteAccount),
    ]);
    this.editUserInfo.applyButton.getNode().remove();
  }

  public drawAddressCard(id: string, address: ProfileAddressValues, addressType: AddressType) {
    const card = this.addressCards.get(id);
    card?.destroyChildren();
    card?.appendChildren(this.getCardContent(id, address, addressType));
  }

  private getCardContent(id: string, address: ProfileAddressValues, addressType: AddressType) {
    const btn = button([styles.profile__editModeCardButton], '');
    btn.append(svg('/assets/img/pen-solid.svg#icon', styles.profile__editModeCardIcon));
    btn.addListener('click', () => this.openEditModal(id));
    return [
      this.getCardTitle(addressType),
      ...getAddressFields(address),
      div([styles.profile__addressTagsWrapper], ...generateAddressTags(addressType)),
      btn,
    ];
  }

  private createAddressCard(address: ProfileAddressValues, id: string, addressType: AddressType) {
    const card = div([styles.profile__editModeAddressesCard]);
    card?.appendChildren(this.getCardContent(id, address, addressType));
    this.addressCards.set(id ?? '', card);
    return card;
  }

  private getCardTitle(addressType: AddressType) {
    let label = addressType.isBilling ? 'Billing Address' : 'Shipping Address';
    label = addressType.isShipping && addressType.isBilling ? 'Billing/Shipping Address' : label;
    return h2([styles.profile__addressCardTitle], label);
  }

  public drawCards(addresses: Map<string, ProfileAddressValues>) {
    this.addressesWrapper.destroyChildren();
    this.addressCards = new Map();
    addresses.forEach((address, id) => {
      this.addressesWrapper.append(this.createAddressCard(address, id, MyCustomer.getAddressType(id ?? '')));
    });
  }
}

export default EditModeForm;
