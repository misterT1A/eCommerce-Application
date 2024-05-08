import BaseComponent from '@components/base-component';

const form = new BaseComponent<HTMLFormElement>(
  { tag: 'form', className: 'login-form', action: '#', autocomplete: 'off' },
  new BaseComponent<HTMLInputElement>({
    tag: 'input',
    type: 'email',
    name: 'email',
    autocomplete: 'username',
    className: 'login-form__input',
    placeholder: 'Email*',
    pattern: '[A-Z][A-Za-z\\-]{2,}',
    required: true,
  }),
  new BaseComponent<HTMLSpanElement>({
    tag: 'span',
    className: 'login-form__error',
    data: {
      errorText: 'Enter your name starting with the capital letter, minimal length is 3',
    },
  }),
  new BaseComponent<HTMLInputElement>({
    tag: 'input',
    type: 'password',
    name: 'password',
    autocomplete: 'current-password',
    className: 'login-form__input',
    placeholder: 'Password*',
    pattern: '(?=.*[0-9]).{4,}',
    required: true,
  }),
  new BaseComponent<HTMLSpanElement>({
    tag: 'span',
    className: 'login-form__error',
    data: {
      errorText: 'Password should contain at least one digit, minimal length is 4',
    },
  }),
  new BaseComponent<HTMLButtonElement>({
    tag: 'button',
    className: 'button',
    textContent: 'Login',
    disabled: true,
  })
);

export default form.getNode();
