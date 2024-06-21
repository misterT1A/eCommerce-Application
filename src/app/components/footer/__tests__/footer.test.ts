import Pages from '@src/app/router/pages';
import Router from '@src/app/router/router';

import FooterController from '../footer-controller';
// import styles from '../style.scss';

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

    Object.defineProperty(footer.getView, 'categories', {
      value: ['bread'],
      writable: true,
    });
  });

  test('should navigate to main page when "Home" and "Catalog" is clicked', () => {
    const mockEventHome = { target: { textContent: 'Home' } };

    const navigateSpy = jest.spyOn(router, 'navigate');
    footer.getView['LinksHandler'](mockEventHome as unknown as Event);
    expect(navigateSpy).toHaveBeenCalledWith(Pages.MAIN);

    const mockEventCatalog = { target: { textContent: 'Catalog' } };
    footer.getView['LinksHandler'](mockEventCatalog as unknown as Event);
    expect(navigateSpy).toHaveBeenCalledWith(Pages.CATALOG);
  });

  test('should not navigate for unknown link', () => {
    const mockEvent = { target: { textContent: 'Unknown Link' } };
    const navigateSpy = jest.spyOn(router, 'navigate');

    footer.getView['LinksHandler'](mockEvent as unknown as Event);

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  test('should add a category block', () => {
    const container = footer.getView['setCategoriesBlock']()?.getNode();

    if (container) {
      expect(container.tagName).toBe('DIV');
    }
  });

  test('should add a links block', () => {
    const container = footer.getView['setLinksBlock']()?.getNode();

    if (container) {
      expect(container.tagName).toBe('DIV');
    }
  });

  test('should add a contact block', () => {
    const container = footer.getView['setContactBlock']()?.getNode();

    if (container) {
      expect(container.tagName).toBe('DIV');
    }
  });

  test('should add an about block', () => {
    const container = footer.getView['aboutBlock']().getNode();

    if (container) {
      expect(container.tagName).toBe('DIV');
    }
  });

  test('should navigate to catalog page when "bread" is clicked', () => {
    const mockEventHome = { target: { dataset: { link: 'bread' } } };

    const setEmpty = jest.spyOn(router, 'setEmptyUrlCatalog');
    const setURL = jest.spyOn(router, 'setUrlCatalog');
    const navigate = jest.spyOn(router, 'navigateToLastPoint');

    footer.getView['categoriesHandler'](mockEventHome as unknown as Event);
    expect(setEmpty).toHaveBeenCalled();
    expect(setURL).toHaveBeenCalledWith('bread');
    expect(navigate).toHaveBeenCalled();
  });

  test('should not navigate for unknown link', () => {
    const mockEventHome = { target: { dataset: { link: 'Unknown Link' } } };

    const setEmpty = jest.spyOn(router, 'setEmptyUrlCatalog');
    const setURL = jest.spyOn(router, 'setUrlCatalog');
    const navigate = jest.spyOn(router, 'navigateToLastPoint');

    footer.getView['categoriesHandler'](mockEventHome as unknown as Event);
    expect(setEmpty).not.toHaveBeenCalled();
    expect(setURL).not.toHaveBeenCalledWith('Unknown Link');
    expect(navigate).not.toHaveBeenCalled();
  });
});
