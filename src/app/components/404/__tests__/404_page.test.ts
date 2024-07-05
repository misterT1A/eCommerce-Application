import Router from '@src/app/router/router';

import Controller404 from '../404_controller';

const routes = [{ path: '', callBack: jest.fn() }];

describe('404 page', () => {
  const router = new Router(routes);
  let controller: Controller404;

  beforeEach(() => {
    controller = new Controller404(router);
  });

  test('should create page view', () => {
    expect(controller.getView.getNode().tagName).toBe('DIV');
  });
});
