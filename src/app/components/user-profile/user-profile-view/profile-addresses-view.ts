import Toggler from '@components/form-ui-elements/formToggler';
import MyCustomer from '@services/customer-service/myCustomer';
import BaseComponent from '@utils/base-component';
import { button, div, h2, li, p, span, ul } from '@utils/elements';

import styles from './_user-profile.scss';
import { generateTagsById, getAddressTitle, getAddressView } from '../profile-helpers';

class ProfileAddressesView extends BaseComponent {
  public addressesList: BaseComponent<HTMLUListElement>;

  public addressContainer: BaseComponent<HTMLElement>;

  public addressesControls: BaseComponent<HTMLElement>;

  private addresses: Map<string, BaseComponent<HTMLLIElement>> = new Map();

  public billingAddressToggler: BaseComponent<HTMLButtonElement>;

  public shippingAddressToggler: BaseComponent<HTMLButtonElement>;

  public addAddressButton: BaseComponent<HTMLButtonElement>;

  constructor(
    private deleteCallback: (id: string) => void,
    private editCallback: (id: string) => void,
    private setAsDefaultShipping: (id: string, reset: boolean) => Promise<void>,
    private setAsDefaultBilling: (id: string, reset: boolean) => Promise<void>
  ) {
    super({ tag: 'div', className: styles.profile__userAddresses }, h2([styles.profile__addressesTitle], 'ADDRESSES'));
    this.addressesList = ul([styles.profile__addressesList]);
    this.addressContainer = div([styles.profile__addressContainer]);
    this.addressesControls = div([styles.profile__addressesControls]);
    this.billingAddressToggler = button([styles.profile__addressToggler], 'default billing');
    this.shippingAddressToggler = button([styles.profile__addressToggler], 'default shipping');
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
          const item = li(
            [styles.profile__addressesListItem],
            span([styles.profile__addressesListItemText], `${getAddressTitle({ isBilling, isShipping })}`),
            span([styles.profile__addressesListItemText_small], `id: ${address.id}`),
            div(
              [styles.profile__addressTagsWrapper],
              ...generateTagsById(address.id).filter((tag) => tag.getNode().textContent?.includes('default'))
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
        const count = item.offsetTop - wrapper.offsetTop - wrapper.scrollTop;
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
    const togglerSetDefaultShipping = new Toggler('Set as default shipping');
    const togglerSetDefaultBilling = new Toggler('Set as default billing');
    this.addressContainer.appendChildren([
      div(
        [],
        h2(
          [styles.profile__addressTitle],
          getAddressTitle({
            isBilling: MyCustomer.isBillingAddress(addressID),
            isShipping: MyCustomer.isShippingAddress(addressID),
          })
        ),
        p([styles.profile__addressId], `id: ${addressID}`)
      ),
      ...getAddressView(address),
      div([styles.profile__addressTagsWrapper], ...generateTagsById(addressID)),
      togglerSetDefaultShipping,
      togglerSetDefaultBilling,
      div([styles.profile__addressButtonsWrapper], editButton, deleteButton),
    ]);
    togglerSetDefaultBilling.setValue(MyCustomer.defaultBillingId === addressID);
    togglerSetDefaultShipping.setValue(MyCustomer.defaultShippingId === addressID);
    this.updateTogglers(
      MyCustomer.addresses.defaultBillingAddress === addressID,
      MyCustomer.addresses.defaultShippingAddress === addressID
    );
    togglerSetDefaultBilling.addListener('input', async () => {
      this.addressContainer.addClass(styles.profile__addressContainer_disabled);
      await this.setAsDefaultBilling(addressID, !togglerSetDefaultBilling.getValue());
      this.addressContainer.removeClass(styles.profile__addressContainer_disabled);
    });
    togglerSetDefaultShipping.addListener('input', async () => {
      this.addressContainer.addClass(styles.profile__addressContainer_disabled);
      await this.setAsDefaultShipping(addressID, !togglerSetDefaultShipping.getValue());
      this.addressContainer.removeClass(styles.profile__addressContainer_disabled);
    });
  }

  public openFirstAddress() {
    if (this.addresses.size) {
      this.openAddress(Array.from(this.addresses.keys())[0]);
    }
  }

  public removeAddress(id: string) {
    this.addresses.delete(id);
  }
}

export default ProfileAddressesView;
