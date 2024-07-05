import HeaderController from '@components/header/header_controller';
import notificationEmitter from '@components/notifications/notifications-controller';
import AuthService from '@services/auth-service';
import Pages from '@src/app/router/pages';
import Router from '@src/app/router/router';

import RegistrationController from '../registration-controller';

const routes = [
  { path: 'login', callBack: jest.fn() },
  { path: 'main', callBack: jest.fn() },
];

describe('RegistrationController', () => {
  const router = new Router(routes);
  let header: HeaderController;
  let regController: RegistrationController;

  beforeEach(() => {
    header = new HeaderController(router);
    regController = new RegistrationController(router, header);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('seListeners', () => {
    it('Registration form should trigger submit button click event on submit event', () => {
      const btnClickSpy = jest.spyOn(regController.getView.button.getNode(), 'click');
      regController.getView.getNode().submit();
      expect(btnClickSpy).toHaveBeenCalled();
    });

    it('The submitForm method should be called on submit button click', () => {
      const submitFormSpy = jest.spyOn(regController, 'submitForm');
      regController.getView.button.getNode().disabled = false;
      regController.getView.button.getNode().click();
      regController.getView.button.getNode().disabled = true;
      expect(submitFormSpy).toHaveBeenCalled();
    });

    it('The toggleAddress method of view should be called on toggler click', () => {
      const togglerSpy = jest.spyOn(regController.getView, 'toggleAddress');
      regController.getView.fields.addresses.addressesToggler.getNode().click();
      expect(togglerSpy).toHaveBeenCalled();
    });
  });

  describe('sendRequest', () => {
    const customerDraft = {
      email: 'test@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2000-01-01',
      addresses: [
        {
          country: 'GB',
          city: 'London',
          postalCode: 'NW1 PP',
          streetName: 'Baker Street',
        },
        {
          country: 'GB',
          city: 'London',
          postalCode: 'NW1 PP',
          streetName: 'Baker Street',
        },
      ],
      shippingAddresses: [0],
      billingAddresses: [1],
      defaultShippingAddress: 0,
      defaultBillingAddress: 1,
      authenticationMode: 'Password',
    };

    it('Should navigate to MAIN page and show success message on success response', async () => {
      const signUp = jest.spyOn(AuthService, 'signUp').mockResolvedValue({ success: true, message: 'OK' });
      const navigate = jest.spyOn(router, 'navigate').mockImplementation(jest.fn());
      const message = jest.spyOn(notificationEmitter, 'showMessage').mockImplementation(jest.fn());
      await regController['sendRequest'](customerDraft);
      expect(signUp).toHaveBeenCalledWith(customerDraft);
      expect(message).toHaveBeenCalledWith({
        messageType: 'success',
        title: 'Account created!',
        text: 'Access your profile to control your personal information and preferences.',
      });
      expect(navigate).toHaveBeenCalledWith(Pages.MAIN);
    });

    it('Should call changeTextLoggined header controller method on success response', async () => {
      const signUp = jest.spyOn(AuthService, 'signUp').mockResolvedValue({ success: true, message: 'OK' });
      const navigate = jest.spyOn(router, 'navigate').mockImplementation(jest.fn());
      const message = jest.spyOn(notificationEmitter, 'showMessage').mockImplementation(jest.fn());
      const headerChange = jest.spyOn(header, 'changeTextLoggined');
      await regController['sendRequest'](customerDraft);
      expect(signUp).toHaveBeenCalledWith(customerDraft);
      expect(message).toHaveBeenCalled();
      expect(navigate).toHaveBeenCalledWith(Pages.MAIN);
      expect(headerChange).toHaveBeenCalled();
    });

    it('Should call notificationEmitter and show errors on error response', async () => {
      const signUp = jest
        .spyOn(AuthService, 'signUp')
        .mockResolvedValue({ success: false, message: 'Error', errors: ['error1', 'error2'] });
      const message = jest.spyOn(notificationEmitter, 'showMessage').mockImplementation(jest.fn());
      await regController['sendRequest'](customerDraft);
      expect(signUp).toHaveBeenCalledWith(customerDraft);
      expect(message).toHaveBeenCalledWith({
        messageType: 'error',
        text: 'error1',
      });
      expect(message).toHaveBeenCalledWith({
        messageType: 'error',
        text: 'error2',
      });
    });
  });

  describe('isValidForm', () => {
    const errorsAddress = {
      defaultAddress: false,
      commonAddress: false,
      city: [],
      street: [],
      country: [],
      zipCode: [],
    };

    const errorsAddressCommon = {
      defaultAddress: false,
      commonAddress: true,
      city: [],
      street: [],
      country: [],
      zipCode: [],
    };

    const errors: IRegistrationErrors = {
      firstName: [],
      lastName: [],
      date: [],
      email: [],
      password: [],
      billingAddress: errorsAddress,
      shippingAddress: errorsAddress,
    };

    const errorsCommon = {
      firstName: [],
      lastName: [],
      date: [],
      email: [],
      password: [],
      shippingAddress: errorsAddressCommon,
    };

    const errorsFilled = {
      firstName: [],
      lastName: [],
      date: ['eee'],
      email: [],
      password: [],
      billingAddress: errorsAddress,
      shippingAddress: errorsAddress,
    };

    it('Should return true if data has only empty errors arrays and common address is provided', () => {
      const isValid = regController['isValidForm'](errorsCommon);
      expect(isValid).toBeTruthy();
    });

    it('Should return true if data has only empty errors arrays and both addresses are provided', () => {
      const isValid = regController['isValidForm'](errors);
      expect(isValid).toBeTruthy();
    });

    it('Should return false if data has errors', () => {
      const isValid = regController['isValidForm'](errorsFilled);
      expect(isValid).toBeFalsy();
    });

    it('Should call updateErrors method for fields with provided errors', () => {
      const spyOnDateField = jest.spyOn(regController.getView.fields.date, 'updateErrors');
      const spyOnStreetField = jest.spyOn(
        regController.getView.fields.addresses.billingAddress.fields.street,
        'updateErrors'
      );
      regController['isValidForm'](errorsFilled);
      expect(spyOnDateField).toHaveBeenCalledWith(['eee']);
      expect(spyOnStreetField).toHaveBeenCalledWith([]);
    });
  });
});
