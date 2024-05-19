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
      const spyOnView = jest.spyOn(regController.getView, 'addListener');
      const btnClickSpy = jest.spyOn(regController.getView.button.getNode(), 'click');
      regController['setListeners']();
      const callback = spyOnView.mock.calls.find((call) => call[0] === 'submit') as [
        event: string,
        listener: (e: unknown) => void,
      ];
      const submitCallback = callback[1];
      const eventMock = { preventDefault: jest.fn() };
      submitCallback(eventMock);
      expect(eventMock.preventDefault).toHaveBeenCalled();
      expect(btnClickSpy).toHaveBeenCalled();
    });

    it('submitForm method should be called on submit button click', () => {
      const spyOnButton = jest.spyOn(regController.getView.button, 'addListener');
      const submitFormSpy = jest.spyOn(regController, 'submitForm');
      regController['setListeners']();
      const callback = spyOnButton.mock.calls.find((call) => call[0] === 'click') as [
        event: string,
        listener: () => void,
      ];
      const clickCallback = callback[1];
      clickCallback();
      expect(submitFormSpy).toHaveBeenCalled();
    });

    it('toggleAddress method of view should be called on toggler click', () => {
      const spyOnToggler = jest.spyOn(regController.getView.fields.addresses.addressesToggler, 'addListener');
      const togglerSpy = jest.spyOn(regController.getView, 'toggleAddress');
      regController['setListeners']();
      const callback = spyOnToggler.mock.calls.find((call) => call[0] === 'click') as [
        event: string,
        listener: () => void,
      ];
      const clickCallback = callback[1];
      clickCallback();
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

    it('Should navigate to MAIN page and show success message on successful request', async () => {
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

    it('Should call changeTextLoggined header controller method on success request', async () => {
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

    it('Should call notificationEmitter on error request', async () => {
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

    it('Should return true if errorsObject has only empty errors arrays and common address provided', () => {
      const isValid = regController['isValidForm'](errorsCommon);
      expect(isValid).toBeTruthy();
    });

    it('Should return true if errorsObject has only empty errors arrays and both addresses are provided', () => {
      const isValid = regController['isValidForm'](errors);
      expect(isValid).toBeTruthy();
    });

    it('Should return false if errorsObject has errors', () => {
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
