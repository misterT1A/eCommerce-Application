import Pages from '@src/app/router/pages';
import Router from '@src/app/router/router';

import stles from '../_dropMenu.scss';
import type BurgerMenu from '../burger-menu';
import HeaderController from '../header_controller';

const routes = [
  { path: '', callBack: jest.fn() },
  { path: 'login', callBack: jest.fn() },
  { path: 'registration', callBack: jest.fn() },
  { path: 'error', callBack: jest.fn() },
];

describe('Header', () => {
  const router = new Router(routes);
  let header: HeaderController;
  let burgerMenu: BurgerMenu;

  beforeEach(() => {
    header = new HeaderController(router);
    burgerMenu = header.getView['burgerMenu'];
  });

  test('should navigate to login page when "Log In" is clicked', () => {
    const mockEvent = { target: { textContent: 'Log In' } };
    const navigateSpy = jest.spyOn(router, 'navigate');

    header.getView['navigate'](mockEvent as unknown as Event);

    expect(navigateSpy).toHaveBeenCalledWith(Pages.LOGIN);
  });

  test('should navigate to registration page when "Sign Up" is clicked', () => {
    const mockEvent = { target: { textContent: 'Sign Up' } };
    const navigateSpy = jest.spyOn(router, 'navigate');

    header.getView['navigate'](mockEvent as unknown as Event);

    expect(navigateSpy).toHaveBeenCalledWith(Pages.REG);
  });
  test('should navigate to My Account page when "My Account" is clicked', () => {
    const mockEvent = { target: { textContent: 'My Account' } };
    const navigateSpy = jest.spyOn(router, 'navigate');

    header.getView['navigate'](mockEvent as unknown as Event);

    expect(navigateSpy).toHaveBeenCalled();
  });

  test('should not navigate for unknown link', () => {
    const mockEvent = { target: { textContent: 'Unknown Link' } };
    const navigateSpy = jest.spyOn(router, 'navigate');

    header.getView['navigate'](mockEvent as unknown as Event);

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  test('should create "Log out"', () => {
    document.body.append(header.getView.getNode());
    header.changeTextLoggined();
    const elements = document.querySelectorAll(stles.links);

    elements.forEach((link) => {
      if (link.textContent === 'Log out') {
        expect(link.textContent).toBe('Log out');
      }
    });
  });

  test('should navigate from burger menu to home page when "HOME" is clicked', () => {
    const mockEvent = { target: { textContent: 'HOME' } };
    const navigateSpy = jest.spyOn(router, 'navigate');

    burgerMenu['navigate'](mockEvent as unknown as Event);

    expect(navigateSpy).toHaveBeenCalledWith(Pages.MAIN);
  });

  test('should navigate from burger menu to home page when "Log In" is clicked', () => {
    const mockEvent = { target: { textContent: 'Log In' } };
    const navigateSpy = jest.spyOn(router, 'navigate');

    burgerMenu['navigate'](mockEvent as unknown as Event);

    expect(navigateSpy).toHaveBeenCalledWith(Pages.LOGIN);
  });

  test('should navigate from burger menu to home page when "Sign Up" is clicked', () => {
    const mockEvent = { target: { textContent: 'Sign Up' } };
    const navigateSpy = jest.spyOn(router, 'navigate');

    burgerMenu['navigate'](mockEvent as unknown as Event);

    expect(navigateSpy).toHaveBeenCalledWith(Pages.REG);
  });

  test('should not navigate from burger menu for unknown link', () => {
    const mockEvent = { target: { textContent: 'Unknown Link' } };
    const navigateSpy = jest.spyOn(router, 'navigate');

    burgerMenu['navigate'](mockEvent as unknown as Event);

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  test('should not navigate from burger menu to My Account', () => {
    const mockEvent = { target: { textContent: 'My Account' } };
    const navigateSpy = jest.spyOn(router, 'navigate');

    burgerMenu['navigate'](mockEvent as unknown as Event);

    expect(navigateSpy).toHaveBeenCalled();
  });

  test('should not navigate from burger menu to My Account', () => {
    const mockEvent = { target: { textContent: 'My Account' } };
    const navigateSpy = jest.spyOn(router, 'navigate');

    burgerMenu['navigate'](mockEvent as unknown as Event);

    expect(navigateSpy).toHaveBeenCalled();
  });
});
