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
});
