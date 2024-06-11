import BaseComponent from '@utils/base-component';
import { button, input } from '@utils/elements';

import styles from './_form-ui-elements.scss';

/**
 * Represents a Count component.
 * @extends BaseComponent
 */
class Count extends BaseComponent {
  private input: BaseComponent<HTMLInputElement>;

  private countMinus: BaseComponent<HTMLButtonElement>;

  private countPlus: BaseComponent<HTMLButtonElement>;

  constructor() {
    super({ tag: 'div' });
    this.addClass(styles.form__count);
    this.input = input([styles.form__inputCount], { type: 'number', value: `1` });
    this.countMinus = button([styles.form__countMinus], '-', { type: 'button' });
    this.countPlus = button([styles.form__countPlus], '+', { type: 'button' });
    this.appendChildren([this.countMinus, this.input, this.countPlus]);
    this.addListener('click', (e) => {
      const { target } = e;
      if (target instanceof HTMLButtonElement) {
        if (target.textContent === '+') {
          this.increase();
        }
        if (target.textContent === '-') {
          this.decrease();
        }
      }
    });
  }

  public getValue(): number {
    return parseInt(this.input.getNode().value, 10);
  }

  private inputEvent() {
    const inputEvent = new Event('input', { bubbles: true });
    this.getNode().dispatchEvent(inputEvent);
  }

  public setValue(count: number) {
    this.input.getNode().value = `${count}`;
  }

  public increase() {
    const current = this.getValue();
    this.setValue(current + 1);
    this.inputEvent();
  }

  public decrease() {
    const current = this.getValue();
    this.setValue(current - 1);
    if (current < 1) {
      this.setValue(0);
    }
    this.inputEvent();
  }
}

export default Count;
