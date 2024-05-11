import BaseComponent from '@utils/base-component';
import { button, input, label, li, span, ul } from '@utils/elements';

import styles from './_form-ui-elements.scss';

/**
 * Represents a form selection component.
 * @extends BaseComponent
 */
class FormSelection extends BaseComponent<HTMLFormElement> {
  public button: BaseComponent<HTMLButtonElement>;

  private inputs: Map<string, BaseComponent<HTMLInputElement>> = new Map();

  /**
   * Creates an instance of FormSelection.
   * @param {string} title - The title of the form selection.
   * @param {string[]} options - An array of options for the selection.
   * @param {string} [value=''] - The initial value of the selection (default is an empty string).
   */
  constructor(
    title: string,
    private options: string[],

    private value = ''
  ) {
    super({ tag: 'form', action: '', className: styles.form__selection }, label([styles.form__inputLabel], title));
    this.button = button([styles.form__selectionButton], '', { type: 'button', value: '' });
    this.button.addListener('click', () => this.toggleList());
    this.addListener('input', () => this.updateAppearance());
    const listItems = this.options.map((option) => {
      const itemInput = input([styles.form__selectionInput], { type: 'radio', name: 'options', value: option });
      this.inputs.set(option, itemInput);
      return li(
        [styles.form__selectionItem],
        label([styles.form__selectionField], '', itemInput, span([styles.form__selectionLabel], option))
      );
    });
    this.appendChildren([this.button, ul([styles.form__selectionList], ...listItems)]);
  }

  public updateAppearance() {
    const formData = new FormData(this.getNode());
    const currentValue = formData.get('options');
    if (!currentValue || typeof currentValue !== 'string') {
      this.value = '';
    } else {
      this.value = currentValue;
    }
    this.button.setTextContent(this.value);
    this.hideList();
  }

  /**
   * Sets the specified option as checked.
   * @param {string} option - The option to set as checked.
   */
  public setOptionChecked(option: string) {
    if (this.inputs.has(option)) {
      const inputOption = this.inputs.get(option)?.getNode();
      if (!(inputOption instanceof HTMLInputElement)) {
        return;
      }
      inputOption.checked = true;
      this.updateAppearance();
    }
  }

  private toggleList() {
    this.getNode().classList.toggle(styles.form__selection_show);
  }

  private hideList() {
    this.removeClass(styles.form__selection_show);
  }

  /**
   * Gets the value of the form selection.
   * @returns {string} - The value of the form selection.
   */
  public getValue(): string {
    return this.value;
  }
}

export default FormSelection;
