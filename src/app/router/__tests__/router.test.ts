import { FILTERS, SORT } from '@components/catalog/filters/constants-filters';

import Router from '../router';
import { checkRightURL, setCategoties, sortUrl } from '../router-helpers';

const routes = [
  { path: '', callBack: jest.fn() },
  { path: 'login', callBack: jest.fn() },
  { path: 'registration', callBack: jest.fn() },
  { path: 'catalog', callBack: jest.fn() },
  { path: 'product', callBack: jest.fn() },
  { path: 'error', callBack: jest.fn() },
];

describe('Router', () => {
  it('should navigate to a specified URL', () => {
    const router = new Router(routes);

    routes.forEach((route) => {
      router.navigate(route.path);
      expect(route.callBack).toHaveBeenCalled();
    });
  });

  let router: Router;
  let mockNavigate: jest.SpyInstance;

  beforeEach(() => {
    router = new Router(routes);
    mockNavigate = jest.spyOn(router, 'navigate').mockImplementation();
  });

  afterEach(() => {
    mockNavigate.mockRestore();
  });

  it('navigateToLastPoint should call navigate with current path', () => {
    const mockPath = 'test-path';
    jest.spyOn(router, 'getCurrentPath').mockReturnValue(mockPath);

    router.navigateToLastPoint();

    expect(mockNavigate).toHaveBeenCalledWith(mockPath);
  });

  it('changeBrowser should call navigate with current path and true as second argument', () => {
    const mockPath = 'test-path';
    jest.spyOn(router, 'getCurrentPath').mockReturnValue(mockPath);

    router['changeBrowser']();

    expect(mockNavigate).toHaveBeenCalledWith(mockPath, true);
  });

  it('getCurrentPath should return current pathname without leading slash', () => {
    const originalLocation = window.location;

    const mockLocation = {
      ...window.location,
      pathname: '/test-path',
    };
    Object.defineProperty(window, 'location', {
      value: mockLocation,
    });

    const result = router.getCurrentPath();
    expect(result).toBe('test-path');

    Object.defineProperty(window, 'location', {
      value: originalLocation,
    });
  });

  it('should set the required url for sort and filters', () => {
    const pushStateSpy = jest.spyOn(window.history, 'pushState');
    const mockPath = '/catalog';
    jest.spyOn(router, 'getCurrentPath').mockReturnValue(mockPath);

    const filters = [...Object.keys(FILTERS), ...Object.keys(SORT)];

    filters.forEach((filter) => {
      router.setUrlCatalog(filter);
      expect(pushStateSpy).toHaveBeenCalledWith(null, '', `/catalog/${filter}`);
    });
  });

  it('should set the required url for categories', () => {
    jest.mock('@components/catalog/filters/constants-filters', () => ({
      CATEGORIES: {
        bread: 'Mock Category 1',
        cakes: 'Mock Category 2',
      },
    }));

    const path = ['bread'];
    const filter = 'bread';
    setCategoties(path, filter);
    expect(path).toEqual([]);
  });

  it('should check Right URL', () => {
    jest.mock('@components/catalog/filters/constants-filters', () => ({
      CATEGORIES: {
        bread: 'Mock Category 1',
      },
      SUBCATEGORIES: {
        baguettes: 'Mock Category 1',
      },
    }));

    const url = 'catalog/IS_VEGAN/PRICE_DESC';
    expect(checkRightURL(url)).toEqual(true);
    const wrongUrl = 'catalog/IS_VEGANdd//PRICE_DESC';
    expect(checkRightURL(wrongUrl)).toEqual(false);
  });

  it('should sort url', () => {
    const url = ['IS_VEGAN', 'PRICE_DESC'];
    expect(sortUrl(url)).toEqual('IS_VEGAN/PRICE_DESC');
  });
});
