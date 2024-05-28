import MyCustomer from '@services/customer-service/myCustomer';
import type BaseComponent from '@utils/base-component';
import { span } from '@utils/elements';

import styles from './user-profile-view/_user-profile.scss';

export default function generateTags(addressID: string) {
  const markers = {
    billing: MyCustomer.addresses.billingAddressIds.includes(addressID),
    shipping: MyCustomer.addresses.shippingAddressIds.includes(addressID),
    defaultBilling: MyCustomer.addresses.defaultBillingAddress === addressID,
    defaultShipping: MyCustomer.addresses.defaultShippingAddress === addressID,
  };
  const tags: BaseComponent[] = [];
  if (markers.billing && !markers.defaultBilling) {
    tags.push(span([styles.profile__addressTag], `billing`));
  }
  if (markers.shipping && !markers.defaultShipping) {
    tags.push(span([styles.profile__addressTag], `shipping`));
  }
  if (markers.defaultBilling) {
    tags.push(span([styles.profile__addressTag], `billing default`));
  }
  if (markers.defaultShipping) {
    tags.push(span([styles.profile__addressTag], `shipping default`));
  }
  return tags;
}
