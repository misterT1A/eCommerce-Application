import AddressField from '@components/form-ui-elements/addressField';
import FormField from '@components/form-ui-elements/formField';
import Pages from '@src/app/router/pages';
import Router from '@src/app/router/router';

import styles from '../registration-view/_registrationForm.scss';
import AddressesFieldset from '../registration-view/addressFieldset';
import RegistrationView from '../registration-view/registration-view';

const routes = [
  { path: 'login', callBack: jest.fn() },
  { path: 'main', callBack: jest.fn() },
];

describe('RegistrationView', () => {
  const router = new Router(routes);
  let registrationView: RegistrationView;

  beforeEach(() => {
    registrationView = new RegistrationView(router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should initialize with correct fields', () => {
    expect(registrationView.fields.firstName).toBeInstanceOf(FormField);
    expect(registrationView.fields.lastName).toBeInstanceOf(FormField);
    expect(registrationView.fields.date).toBeInstanceOf(FormField);
    expect(registrationView.fields.email).toBeInstanceOf(FormField);
    expect(registrationView.fields.password).toBeInstanceOf(FormField);
    expect(registrationView.fields.addresses).toBeInstanceOf(AddressesFieldset);
    expect(registrationView.button).toBeDefined();
  });

  it('Should disable the button', () => {
    registrationView.disableButton();
    expect(registrationView.button.getNode().disabled).toBe(true);
  });

  it('Should unlock the button', () => {
    registrationView.unlockButton();
    expect(registrationView.button.getNode().disabled).toBe(false);
  });

  it('Should get correct values from fields when getValues is called', () => {
    const mockFormData = {
      firstName: 'John',
      lastName: 'Doe',
      date: '2000-01-01',
      email: 'john.doe@example.com',
      password: 'password123',
      addresses: {
        shippingAddress: {
          city: 'City',
          street: 'Street',
          country: 'UK',
          zipCode: '00000',
          commonAddress: false,
          defaultAddress: false,
        },
        billingAddress: {
          city: 'City',
          street: 'Street',
          country: 'UK',
          zipCode: '00000',
          commonAddress: false,
          defaultAddress: false,
        },
      },
    };

    jest.spyOn(registrationView.fields.firstName, 'getValue').mockReturnValue(mockFormData.firstName);
    jest.spyOn(registrationView.fields.lastName, 'getValue').mockReturnValue(mockFormData.lastName);
    jest.spyOn(registrationView.fields.date, 'getValue').mockReturnValue(mockFormData.date);
    jest.spyOn(registrationView.fields.email, 'getValue').mockReturnValue(mockFormData.email);
    jest.spyOn(registrationView.fields.password, 'getValue').mockReturnValue(mockFormData.password);
    jest.spyOn(registrationView.fields.addresses, 'getValue').mockReturnValue(mockFormData.addresses);

    expect(registrationView.getValues()).toEqual(mockFormData);
  });

  it('Should toggle address fieldset when toggleAddress is called', () => {
    const addressToggler = jest.spyOn(registrationView.fields.addresses, 'toggleAddress');
    registrationView.toggleAddress();
    expect(addressToggler).toHaveBeenCalled();
  });

  it('Should navigate to login page on login link click', () => {
    const loginLink = registrationView.getNode().querySelector(`a[href="./login"]`);
    expect(loginLink).not.toBeNull();

    if (loginLink) {
      const navigateSpy = jest.spyOn(router, 'navigate');
      (loginLink as HTMLElement).click();
      expect(navigateSpy).toHaveBeenCalledWith(Pages.LOGIN);
    }
  });
});

describe('RegistrationView', () => {
  let addressesFieldset: AddressesFieldset;

  beforeEach(() => {
    addressesFieldset = new AddressesFieldset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should initialize with correct elements', () => {
    expect(addressesFieldset.addressesToggler).toBeDefined();
    expect(addressesFieldset.shippingAddress).toBeInstanceOf(AddressField);
    expect(addressesFieldset.billingAddress).toBeInstanceOf(AddressField);
  });

  it('Should toggle billing and shipping address visibility', () => {
    addressesFieldset.setStatus('shipping');
    addressesFieldset.toggleAddress();
    expect(addressesFieldset.getNode().classList.contains(styles.form__addresses_billing)).toBe(true);
    addressesFieldset.toggleAddress();
    expect(addressesFieldset.getNode().classList.contains(styles.form__addresses_shipping)).toBe(true);
  });

  it('Should set billing and shipping address visibility', () => {
    addressesFieldset.setStatus('billing');
    expect(addressesFieldset.getNode().classList.contains(styles.form__addresses_billing)).toBe(true);
    addressesFieldset.setStatus('shipping');
    expect(addressesFieldset.getNode().classList.contains(styles.form__addresses_shipping)).toBe(true);
  });

  it('Should get correct values from address fields', () => {
    const mockAddressData = {
      city: 'City',
      street: 'Street',
      country: 'UK',
      zipCode: '00000',
      commonAddress: false,
      defaultAddress: false,
    };

    jest.spyOn(addressesFieldset.shippingAddress, 'getValue').mockReturnValue(mockAddressData);
    jest.spyOn(addressesFieldset.billingAddress, 'getValue').mockReturnValue(mockAddressData);

    expect(addressesFieldset.getValue()).toEqual({
      shippingAddress: mockAddressData,
      billingAddress: mockAddressData,
    });
  });
});
