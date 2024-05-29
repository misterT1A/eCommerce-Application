import FormField from '@components/form-ui-elements/formField';
import MyCustomer from '@services/customer-service/myCustomer';
import RegistrationValidator from '@services/registrationValidationService/registrationValidator';
import type BaseComponent from '@utils/base-component';
import { span } from '@utils/elements';

import styles from './user-profile-view/_user-profile.scss';
import type UserAddressEdit from './user-profile-view/edit-mode/edit-address';

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

export function processAddressData(form: UserAddressEdit) {
  let isValidForm = true;
  const errorsObject = RegistrationValidator.processAddressInfo(form.getValues());
  Object.entries(errorsObject).forEach(([key, errors]) => {
    if (errors.length > 0) {
      isValidForm = false;
    }
    const field = form.fields[key as ProfileAddressesFieldsType];
    if (field instanceof FormField) {
      field.updateErrors(errors);
    }
  });
  return {
    isValidForm,
  };
}
