import HeaderController from '@components/header/header_controller';
import RegistrationValidator from '@services/registrationValidationService/registrationValidator';
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

  describe('validateForm', () => {
    const validAddress: IAddressData = {
      defaultAddress: false,
      commonAddress: false,
      city: 'Paris',
      street: 'TTTTTnn sdf',
      country: 'France',
      zipCode: '75008',
    };

    const validAddressCommon: IAddressData = {
      defaultAddress: false,
      commonAddress: true,
      city: 'Paris',
      street: 'TTTTTnn sdf',
      country: 'France',
      zipCode: '75008',
    };

    const formData: IRegistrationFormData = {
      email: 'test@example.com',
      password: 'passwIII777ord',
      firstName: 'John',
      lastName: 'Doe',
      date: '2000-01-01',
      addresses: {
        shippingAddress: validAddress,
        billingAddress: validAddress,
      },
    };

    const formDataCommon: IRegistrationFormData = {
      email: 'test@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
      date: '2000-01-01',
      addresses: {
        shippingAddress: validAddressCommon,
      },
    };

    const errorsAddress = {
      defaultAddress: false,
      commonAddress: false,
      city: [],
      street: [],
      country: [],
      zipCode: [],
    };

    const errorsCommon: IRegistrationErrors = {
      firstName: [],
      lastName: [],
      date: [],
      email: [],
      password: [],
      shippingAddress: errorsAddress,
      billingAddress: errorsAddress,
    };

    it('Should validate form data via RegistrationValidator', () => {
      const spyOnView = jest.spyOn(regController.getView, 'getValues').mockReturnValue(formData);
      const spyOnRegValidator = jest.spyOn(RegistrationValidator, 'processFormData');
      const event = new CustomEvent('input');
      regController.getView.getNode().dispatchEvent(event);
      expect(spyOnView).toHaveBeenCalled();
      expect(spyOnRegValidator).toHaveBeenCalledWith(formData);
    });

    it('Should change addresses toggler appearance if one of address set as common', () => {
      const spyOnView = jest.spyOn(regController.getView, 'getValues').mockReturnValue(formDataCommon);
      const spyOnSetCommon = jest.spyOn(regController.getView.fields.addresses, 'setCommon');
      const event = new CustomEvent('input');
      regController.getView.getNode().dispatchEvent(event);
      expect(spyOnView).toHaveBeenCalled();
      expect(spyOnSetCommon).toHaveBeenCalled();
    });

    it('Should lock button if provided data is invalid', () => {
      const spyOnView = jest.spyOn(regController.getView, 'getValues').mockReturnValue(formDataCommon);
      const event = new CustomEvent('input');
      regController.getView.getNode().dispatchEvent(event);
      expect(spyOnView).toHaveBeenCalled();
      const isLocked = regController.getView.button.getNode().disabled;
      expect(isLocked).toBeTruthy();
    });

    it('Should unlock button if provided data is valid', () => {
      const spyOnView = jest.spyOn(regController.getView, 'getValues').mockReturnValue(formData);
      const spyOnRegValidator = jest.spyOn(RegistrationValidator, 'processFormData').mockReturnValue(errorsCommon);
      const event = new CustomEvent('input');
      regController.getView.getNode().dispatchEvent(event);
      expect(spyOnView).toHaveBeenCalled();
      expect(spyOnRegValidator).toHaveBeenCalled();
      const isLocked = regController.getView.button.getNode().disabled;
      expect(isLocked).toBeFalsy();
    });
  });
});
