import BaseComponent from '@utils/base-component';
import { div, input, label, li, span, svg, ul } from '@utils/elements';

import styles from './_form-ui-elements.scss';

/**
 * Represents a form selection component.
 * @extends BaseComponent
 */
class FormSelectionMultiple extends BaseComponent<HTMLFormElement> {
  public button: BaseComponent<HTMLElement>;

  private inputs: Map<string, BaseComponent<HTMLInputElement>> = new Map();

  private selectedOptions: Map<string, BaseComponent<HTMLSpanElement>> = new Map();

  /**
   * Creates an instance of FormSelection.
   * @param {string} title - The title of the form selection.
   * @param {string[]} options - An array of options for the selection.
   * @param {string[]} [selected = []] - The initially selected values (default is an empty array).
   */
  constructor(
    title: string,
    private options: string[],

    private selected: string[] = []
  ) {
    super({ tag: 'form', action: '', className: styles.form__selection }, label([styles.form__inputLabel], title));
    const overlay = div([styles.form__selectionOverlay]);
    overlay.addListener('click', () => this.hideList());
    this.append(overlay);
    this.button = div([styles.form__selectionContainer]);
    this.button.addListener('click', () => this.toggleList());
    this.addListener('input', () => this.updateAppearance());
    const listItems = this.options.map((option) => {
      const itemInput = input([styles.form__selectionInput], { type: 'checkbox', name: option, value: option });
      this.inputs.set(option, itemInput);
      return li(
        [styles.form__selectionItem],
        label([styles.form__selectionField], '', itemInput, span([styles.form__selectionLabel], option))
      );
    });
    this.appendChildren([
      div(
        [styles.form__selectionButtonWrapper],
        svg('./assets/img/arrow.svg#arrow', styles.form__selectionIcon),
        this.button,
        ul([styles.form__selectionList], ...listItems)
      ),
    ]);
    this.setOptionsChecked(this.selected);
    this.updateAppearance();
  }

  public updateAppearance() {
    const formData = new FormData(this.getNode());
    this.selected = this.options.filter((opt) => formData.get(opt));
    this.setOptionsChecked(this.selected);
  }

  /**
   * Sets the specified options as checked.
   * @param {string[]} options - The options to set as checked.
   */
  public setOptionsChecked(options: string[]) {
    this.selected = options.filter((option) => this.inputs.has(option));
    this.button.destroyChildren();
    this.options.forEach((option) => {
      const selectedInput = this.inputs.get(option);
      if (this.selected.includes(option)) {
        if (selectedInput) {
          selectedInput.getNode().checked = true;
        }
        const tag = span(
          [styles.form__selectionTag],
          option,
          svg('./assets/img/notif-error.svg#icon', styles.form__tagIcon)
        );
        tag.addListener('click', (e) => {
          if (selectedInput) {
            selectedInput.getNode().checked = false;
            this.updateAppearance();
            e.stopPropagation();
          }
        });
        this.selectedOptions.set(option, tag);
      } else if (selectedInput) {
        selectedInput.getNode().checked = false;
        if (this.selectedOptions.has(option)) {
          this.selectedOptions.get(option)?.destroy();
          this.selectedOptions.delete(option);
        }
      }
    });
    const visibleTags = Array.from(this.selectedOptions.values()).slice(0, 2);
    visibleTags.forEach((tag) => {
      this.button.append(tag);
    });
    if (this.selectedOptions.size > 2) {
      this.button.append(span([styles.form__selectionTag], `+${this.selectedOptions.size - 2}`));
    }
  }

  private toggleList() {
    this.getNode().classList.toggle(styles.form__selection_show);
  }

  private hideList() {
    this.removeClass(styles.form__selection_show);
  }

  /**
   * Gets the value of the form selection (array of selected options).
   * @returns {string[]} - The value of the form selection.
   */
  public getValue(): string[] {
    return this.selected;
  }
}

export default FormSelectionMultiple;
