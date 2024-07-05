import styles from '../_form-ui-elements.scss';
import Checkbox from '../formCheckbox';

describe('Checkbox', () => {
  let checkbox: Checkbox;

  beforeEach(() => {
    checkbox = new Checkbox('Test Checkbox');
  });

  it('Should initialize and render elements correctly with given label text', () => {
    expect(checkbox).toBeInstanceOf(Checkbox);
    expect(checkbox.getNode().querySelector(`.${styles.form__checkmarkLabel}`)?.textContent).toBe('Test Checkbox');

    document.body.appendChild(checkbox.getNode());

    expect(document.body.contains(checkbox.getNode())).toBe(true);
    expect(checkbox.getNode().querySelector(`.${styles.form__inputCheckbox}`)).toBeTruthy();
    expect(checkbox.getNode().querySelector(`.${styles.form__inputCheckmark}`)).toBeTruthy();
    expect(checkbox.getNode().querySelector(`.${styles.form__checkmarkLabel}`)).toBeTruthy();

    document.body.removeChild(checkbox.getNode());
  });

  it('Should return correct checkbox value', () => {
    const inputElement = checkbox.getNode().querySelector(`.${styles.form__inputCheckbox}`) as HTMLInputElement;
    inputElement.checked = true;
    expect(checkbox.getValue()).toBe(true);

    inputElement.checked = false;
    expect(checkbox.getValue()).toBe(false);
  });

  it('Should set checkbox value correctly', () => {
    const inputElement = checkbox.getNode().querySelector(`.${styles.form__inputCheckbox}`) as HTMLInputElement;

    checkbox.setValue(true);
    expect(inputElement.checked).toBe(true);

    checkbox.setValue(false);
    expect(inputElement.checked).toBe(false);
  });
});
