import Pages from '@src/app/router/pages';
import Router from '@src/app/router/router';

import LoginView from '../login-view';

describe('LoginView', () => {
  let mockRouter: Router;
  let loginView: LoginView;

  beforeEach(() => {
    mockRouter = new Router([{ path: Pages.REG, callBack: jest.fn() }]);
    jest.spyOn(mockRouter, 'navigate');
    loginView = new LoginView(mockRouter);
  });

  it('registration link should navigate to registration page when clicked', () => {
    const registerLink = loginView.getNode().querySelector('a');
    registerLink?.click();
    expect(mockRouter.navigate).toHaveBeenCalledWith(Pages.REG);
  });
});
