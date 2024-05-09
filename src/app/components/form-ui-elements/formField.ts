import BaseComponent from '@utils/base-component';
import { button, div, input, label, p } from '@utils/elements';

import styles from './_form-ui-elements.scss';

class FormField extends BaseComponent {
  private input: BaseComponent<HTMLInputElement>;

  private errors: BaseComponent<HTMLElement>;

  private inputWrapper: BaseComponent<HTMLElement>;

  constructor(name: string, type: string, pattern: string, required = true) {
    super({ tag: 'div' }, label([styles.form__inputLabel], name));
    this.input = input([styles.form__input], { type, value: '', pattern, required });
    this.errors = div([styles.form__errors]);
    this.inputWrapper = div([styles.form__inputWrapper], this.input);
    if (name === 'Password') {
      const togglerPasswordVisibility = button([styles.form__inputPasswordToggler], '');
      togglerPasswordVisibility.addListener('click', () => this.toggleFieldType());
      this.inputWrapper.appendChildren([togglerPasswordVisibility]);
    }
    this.appendChildren([this.inputWrapper, this.errors]);
  }

  public getValue(): string {
    return this.input.getNode().value;
  }

  private toggleFieldType() {
    const inputType = this.input.getNode().type;
    this.inputWrapper.getNode().classList.toggle(styles.form__inputPasswordToggler_visible);
    this.input.getNode().type = inputType === 'text' ? 'password' : 'text';
  }

  public updateErrors(...errors: string[]): void {
    this.errors.destroyChildren();
    [...errors].forEach((error) => this.errors.appendChildren([p([styles.form__inputError], error)]));
  }
}

export default FormField;
