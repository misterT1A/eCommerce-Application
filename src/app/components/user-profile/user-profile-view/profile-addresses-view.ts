import MyCustomer from '@services/customer-service/myCustomer';
import BaseComponent from '@utils/base-component';
import { button, div, h2, li, span, ul } from '@utils/elements';

import styles from './_user-profile.scss';
import { getCountryName } from '../edit-mode-adapters';
import generateTags from '../profile-helpers';

class ProfileAddressesView extends BaseComponent {
  public addressesList: BaseComponent<HTMLUListElement>;

  public addressContainer: BaseComponent<HTMLElement>;

  public addressesControls: BaseComponent<HTMLElement>;

  private addresses: Map<string, BaseComponent<HTMLLIElement>> = new Map();

  private billingAddressToggler: BaseComponent<HTMLButtonElement>;

  private shippingAddressToggler: BaseComponent<HTMLButtonElement>;

  public addAddressButton: BaseComponent<HTMLButtonElement>;

  constructor(
    private deleteCallback: (id: string) => void,
    private editCallback: (id: string) => void
  ) {
    super({ tag: 'div', className: styles.profile__userAddresses }, h2([styles.profile__addressesTitle], 'ADDRESSES'));
    this.addressesList = ul([styles.profile__addressesList]);
    this.addressContainer = div([styles.profile__addressContainer]);
    this.addressesControls = div([styles.profile__addressesControls]);
    this.billingAddressToggler = button([styles.profile__addressToggler], 'default billing');
    this.billingAddressToggler.addListener('click', () =>
      this.openAddress(MyCustomer.addresses.defaultBillingAddress ?? '')
    );
    this.shippingAddressToggler = button([styles.profile__addressToggler], 'default shipping');
    this.shippingAddressToggler.addListener('click', () =>
      this.openAddress(MyCustomer.addresses.defaultShippingAddress ?? '')
    );
    this.addAddressButton = button([styles.profile__button], 'ADD ADDRESS');
    this.addressesControls.appendChildren([
      this.billingAddressToggler,
      this.shippingAddressToggler,
      this.addAddressButton,
    ]);
    this.appendChildren([this.addressesList, this.addressContainer, this.addressesControls]);
    this.updateView();
  }

  private clearContainers() {
    this.addressesList.destroyChildren();
    this.addressContainer.destroyChildren();
  }

  private updateTogglers(isBillingDefault: boolean, isShippingDefault: boolean) {
    this.billingAddressToggler.removeClass(styles.profile__addressToggler_active);
    this.shippingAddressToggler.removeClass(styles.profile__addressToggler_active);
    if (isBillingDefault) {
      this.billingAddressToggler.addClass(styles.profile__addressToggler_active);
    }
    if (isShippingDefault) {
      this.shippingAddressToggler.addClass(styles.profile__addressToggler_active);
    }
  }

  public updateView() {
    const { addresses } = MyCustomer;
    this.billingAddressToggler.getNode().disabled = !MyCustomer.addresses.defaultBillingAddress;
    this.shippingAddressToggler.getNode().disabled = !MyCustomer.addresses.defaultShippingAddress;
    this.clearContainers();
    if (addresses.addresses.length) {
      addresses.addresses.forEach((address) => {
        if (address.id) {
          const isBilling = addresses.billingAddressIds.includes(address.id);
          const isShipping = addresses.shippingAddressIds.includes(address.id);
          let label = isBilling ? 'Billing Address' : 'Shipping Address';
          label = isShipping && isBilling ? 'Billing/Shipping Address' : label;
          const item = li(
            [styles.profile__addressesListItem],
            span([styles.profile__addressesListItemText], `${label}`),
            span([styles.profile__addressesListItemText_small], `id: ${address.id}`),
            div(
              [styles.profile__addressTagsWrapper],
              ...generateTags(address.id).filter((tag) => tag.getNode().textContent?.includes('default'))
            )
          );
          item.addListener('click', () => {
            this.showAddress(address.id ?? '');
            this.setActive(address.id ?? '');
          });
          this.addressesList.append(item);
          this.addresses.set(address.id, item);
        }
      });
    }
  }

  public openAddress(id: string) {
    if (this.addresses.has(id)) {
      this.addresses.get(id)?.getNode().click();
      const wrapper = this.addressesList.getNode();
      const item = this.addresses.get(id)?.getNode();
      if (item) {
        const count = item.offsetTop - wrapper.scrollTop - 10;
        wrapper.scrollBy({ top: count, left: 0, behavior: 'smooth' });
      }
    }
  }

  private setActive(id: string) {
    this.addresses.forEach((address) => address.removeClass(styles.profile__addressesListItem_active));
    this.addresses.get(id)?.addClass(styles.profile__addressesListItem_active);
  }

  private showAddress(addressID: string) {
    this.addressContainer.destroyChildren();
    const address = MyCustomer.getAddressById(addressID);
    if (!address) {
      return;
    }
    const editButton = button([styles.profile__button], 'EDIT');
    const deleteButton = button([styles.profile__button], 'DELETE');
    editButton.addListener('click', () => this.editCallback(addressID));
    deleteButton.addListener('click', () => this.deleteCallback(addressID));
    this.addressContainer.appendChildren([
      this.wrapField('City:', span([styles.profile__addressesField], address.city ?? '')),
      this.wrapField('Country:', span([styles.profile__addressesField], getCountryName(address.country) ?? '')),
      this.wrapField('Street:', span([styles.profile__addressesField], address.streetName ?? '')),
      this.wrapField('Postal Code:', span([styles.profile__addressesField], address.postalCode ?? '')),
      div([styles.profile__addressTagsWrapper], ...generateTags(addressID)),
      div([styles.profile__addressButtonsWrapper], editButton, deleteButton),
    ]);
    this.updateTogglers(
      MyCustomer.addresses.defaultBillingAddress === addressID,
      MyCustomer.addresses.defaultShippingAddress === addressID
    );
  }

  private wrapField(label: string, field: BaseComponent) {
    return div([styles.profile__userInfoDataWrapper], span([styles.profile__userInfoDataLabel], label), field);
  }
}

export default ProfileAddressesView;
