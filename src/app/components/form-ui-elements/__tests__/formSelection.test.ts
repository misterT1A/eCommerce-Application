import styles from '../_form-ui-elements.scss';
import FormSelection from '../formSelection';

describe('FormSelection', () => {
  let formSelection: FormSelection;

  beforeEach(() => {
    formSelection = new FormSelection('Select Country', ['UK', 'France', 'Belgium'], 'Belgium');
  });

  it('Should initialize and render elements correctly with given title, options, and default value', () => {
    expect(formSelection).toBeInstanceOf(FormSelection);
    expect(formSelection.getNode().querySelector(`.${styles.form__inputLabel}`)?.textContent).toBe('Select Country');
    expect(formSelection.getValue()).toBe('Belgium');

    document.body.appendChild(formSelection.getNode());

    expect(document.body.contains(formSelection.getNode())).toBe(true);
    expect(formSelection.getNode().querySelector(`.${styles.form__selectionButton}`)).toBeTruthy();
    expect(formSelection.getNode().querySelector(`.${styles.form__selectionList}`)).toBeTruthy();

    document.body.removeChild(formSelection.getNode());
  });

  it('Should return correct value using getValue method', () => {
    expect(formSelection.getValue()).toBe('Belgium');
  });

  it('Should set option correctly using setOptionChecked method', () => {
    formSelection.setValue('UK');
    expect(formSelection.getValue()).toBe('UK');

    const inputElement = formSelection.getNode().querySelector(`input[value="UK"]`) as HTMLInputElement;
    expect(inputElement.checked).toBe(true);
  });

  it('Should update button text and appearance on option change', () => {
    formSelection.setValue('France');
    expect(formSelection.getValue()).toBe('France');
    expect(formSelection.getNode().querySelector(`.${styles.form__selectionButton}`)?.textContent).toBe('France');
  });

  it('Should toggle and hide list when click on field', () => {
    formSelection.getNode().querySelector(`.${styles.form__selectionButton}`)?.dispatchEvent(new Event('click'));
    expect(formSelection.getNode().classList.contains(styles.form__selection_show)).toBe(true);

    formSelection.getNode().querySelector(`.${styles.form__selectionButton}`)?.dispatchEvent(new Event('click'));
    expect(formSelection.getNode().classList.contains(styles.form__selection_show)).toBe(false);
  });
});
