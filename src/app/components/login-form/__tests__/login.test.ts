import Pages from '@src/app/router/pages';
import Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';

import style from '../_login-form.scss';
import LoginView from '../login-view';

describe('LoginView', () => {
  let mockRouter: Router;
  let loginView: LoginView;

  beforeEach(() => {
    mockRouter = new Router([{ path: Pages.REG, callBack: jest.fn() }]);
    jest.spyOn(mockRouter, 'navigate');
    loginView = new LoginView(mockRouter);
  });

  it('createSubmitButton method creates a proper button', () => {
    const submitButton = loginView['createSubmitButton']();
    expect(submitButton).toBeInstanceOf(BaseComponent);
    expect(submitButton.getNode().tagName).toBe('BUTTON');
    expect(submitButton.getNode().className).toBe(style.button);
    expect(submitButton.getNode().type).toBe('submit');
    expect(submitButton.getNode().textContent).toBe('Login');
  });

  it('registration link should navigate to registration page when clicked', () => {
    const registerLink = loginView.getNode().querySelector('a');
    registerLink?.click();
    expect(mockRouter.navigate).toHaveBeenCalledWith(Pages.REG);
  });
});
