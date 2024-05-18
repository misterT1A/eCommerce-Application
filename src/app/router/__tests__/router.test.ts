import Router from '../router';

const routes = [
  { path: '', callBack: jest.fn() },
  { path: 'login', callBack: jest.fn() },
  { path: 'registration', callBack: jest.fn() },
  { path: 'error', callBack: jest.fn() },
];

describe('Router', () => {
  it('should navigate to a specified URL', () => {
    const router = new Router(routes);

    routes.forEach((route) => {
      router.navigate(route.path);
      expect(route.callBack).toHaveBeenCalledTimes(1);
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
});
