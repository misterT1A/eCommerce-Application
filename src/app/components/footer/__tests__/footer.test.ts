import Pages from '@src/app/router/pages';
import Router from '@src/app/router/router';

import FooterController from '../footer-controller';

const routes = [
  { path: '', callBack: jest.fn() },
  { path: 'login', callBack: jest.fn() },
  { path: 'registration', callBack: jest.fn() },
  { path: 'error', callBack: jest.fn() },
];

describe('Footer', () => {
  const router = new Router(routes);
  let footer: FooterController;

  beforeEach(() => {
    footer = new FooterController(router);
  });

  test('should navigate to main page when "Home" is clicked', () => {
    const mockEvent = { target: { textContent: 'Home' } };
    const navigateSpy = jest.spyOn(router, 'navigate');

    footer.getView['LinksHandler'](mockEvent as unknown as Event);

    expect(navigateSpy).toHaveBeenCalledWith(Pages.MAIN);
  });

  test('should not navigate for unknown link', () => {
    const mockEvent = { target: { textContent: 'Unknown Link' } };
    const navigateSpy = jest.spyOn(router, 'navigate');

    footer.getView['LinksHandler'](mockEvent as unknown as Event);

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
