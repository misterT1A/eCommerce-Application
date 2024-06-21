// import Pages from '@src/app/router/pages';
import Router from '@src/app/router/router';

import styles from '../_styles.scss';
import MainController from '../main-controller';

const routes = [
  { path: '', callBack: jest.fn() },
  { path: 'login', callBack: jest.fn() },
  { path: 'registration', callBack: jest.fn() },
  { path: 'error', callBack: jest.fn() },
];

describe('Main', () => {
  const router = new Router(routes);

  let main: MainController;

  let parentElement: HTMLElement;
  let targetElement: HTMLElement;

  // Создаем mockEvent
  let mockEvent: Event;

  beforeEach(() => {
    main = new MainController(router);

    parentElement = document.createElement('div');
    parentElement.className = styles.links_block;

    targetElement = document.createElement('span');

    parentElement.appendChild(targetElement);

    mockEvent = {
      target: targetElement,
    } as unknown as Event;
  });

  test('should navigate to Catalog page when For Kids is clicked', () => {
    parentElement.dataset.link = 'For Kids';
    targetElement.textContent = 'For Kids';

    const navigateSpy = jest.spyOn(router, 'setUrlCatalog');

    main.getView['categoriesHandler'](mockEvent);

    expect(navigateSpy).toHaveBeenCalledWith('IS_KIDS');
  });

  test('should navigate to Catalog page when Vegan is clicked', () => {
    parentElement.dataset.link = 'Vegan';
    targetElement.textContent = 'Vegan';

    const navigateSpy = jest.spyOn(router, 'setUrlCatalog');

    main.getView['categoriesHandler'](mockEvent);

    expect(navigateSpy).toHaveBeenCalledWith('IS_VEGAN');
  });

  test('should navigate to Catalog page when On sale is clicked', () => {
    parentElement.dataset.link = 'On sale';
    targetElement.textContent = 'On sale';

    const navigateSpy = jest.spyOn(router, 'setUrlCatalog');

    main.getView['categoriesHandler'](mockEvent);

    expect(navigateSpy).toHaveBeenCalledWith('IS_SALE');
  });
});
