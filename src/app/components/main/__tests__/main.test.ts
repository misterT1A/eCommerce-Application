import Pages from '@src/app/router/pages';
import Router from '@src/app/router/router';

import MainController from '../main-controller';

const routes = [
  { path: '', callBack: jest.fn() },
  { path: 'login', callBack: jest.fn() },
  { path: 'registration', callBack: jest.fn() },
  { path: 'error', callBack: jest.fn() },
];

describe('Header', () => {
  const router = new Router(routes);
  let main: MainController;

  beforeEach(() => {
    main = new MainController(router);
  });

  test('should navigate to login page when "Log In" is clicked', () => {
    const mockEvent = { target: { textContent: 'Log In' } };
    const navigateSpy = jest.spyOn(router, 'navigate');

    main.getView['navigate'](mockEvent as unknown as Event);

    expect(navigateSpy).toHaveBeenCalledWith(Pages.LOGIN);
  });

  test('should navigate to registration page when "Sign Up" is clicked', () => {
    const mockEvent = { target: { textContent: 'Sign Up' } };
    const navigateSpy = jest.spyOn(router, 'navigate');

    main.getView['navigate'](mockEvent as unknown as Event);

    expect(navigateSpy).toHaveBeenCalledWith(Pages.REG);
  });

  test('should not navigate for unknown link', () => {
    const mockEvent = { target: { textContent: 'Unknown Link' } };
    const navigateSpy = jest.spyOn(router, 'navigate');

    main.getView['navigate'](mockEvent as unknown as Event);

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
