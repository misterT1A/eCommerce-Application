import BaseComponent from '@utils/base-component';
import { button, input, label, li, span, ul } from '@utils/elements';

import styles from './_form-ui-elements.scss';

class FormSelection extends BaseComponent<HTMLFormElement> {
  public button: BaseComponent<HTMLButtonElement>;

  constructor(
    title: string,
    private options: string[],

    private value = ''
  ) {
    super({ tag: 'form', action: '', className: styles.form__selection }, label([styles.form__selectionName], title));
    this.button = button([styles.form__selectionButton], '', { type: 'button', value: '' });
    const list = ul(
      [styles.form__selectionList],
      ...this.options.map((option) =>
        li(
          [styles.form__selectionItem],
          label(
            [styles.form__selectionField],
            '',
            input([styles.form__selectionInput], { type: 'radio', name: 'options', value: option }),
            span([styles.form__selectionLabel], option)
          )
        )
      )
    );
    this.appendChildren([this.button, list]);
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
  }

  public getValue() {
    return this.value;
  }
}

export default FormSelection;
