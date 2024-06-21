import styles from '../_form-ui-elements.scss';
import FormField from '../formField';

describe('FormField', () => {
  let formField: FormField;

  beforeEach(() => {
    formField = new FormField('Test Field', 'text');
  });

  it('Should initialize and render form field correctly with given parameters', () => {
    const requiredField = new FormField('Required Field', 'text', true);
    expect(requiredField).toBeInstanceOf(FormField);
    expect(requiredField.getValue()).toBe('');
    const optionalField = new FormField('Optional Field', 'text', false);
    expect(optionalField).toBeInstanceOf(FormField);
    expect(optionalField.getValue()).toBe('');

    document.body.appendChild(formField.getNode());

    expect(document.body.contains(formField.getNode())).toBe(true);
    expect(formField.getNode().querySelector(`.${styles.form__input}`)).toBeTruthy();
    expect(formField.getNode().querySelector(`.${styles.form__errors}`)).toBeTruthy();

    document.body.removeChild(formField.getNode());
  });

  it('Should return correct input value', () => {
    const inputElement = formField.getNode().querySelector(`.${styles.form__input}`) as HTMLInputElement;
    inputElement.value = 'Test Value';
    expect(formField.getValue()).toBe('Test Value');
  });

  it('Should toggle password visibility correctly', () => {
    const passwordField = new FormField('Password', 'password');
    document.body.appendChild(passwordField.getNode());
    const toggleButton = passwordField
      .getNode()
      .querySelector(`.${styles.form__inputPasswordToggler}`) as HTMLButtonElement;

    expect(passwordField.getNode().querySelector('input')?.type).toBe('password');
    toggleButton.click();
    expect(passwordField.getNode().querySelector('input')?.type).toBe('text');
    toggleButton.click();
    expect(passwordField.getNode().querySelector('input')?.type).toBe('password');

    document.body.removeChild(passwordField.getNode());
  });

  it('Should initialize and update date field correctly', () => {
    const dateField = new FormField('Date of Birth', 'date');
    document.body.appendChild(dateField.getNode());

    const dateInput = dateField.getNode().querySelector('input[type="date"]') as HTMLInputElement;
    const dateLabel = dateField.getNode().querySelector(`.${styles.form__inputDateLabel}`) as HTMLSpanElement;

    dateInput.value = '2024-05-18';
    dateInput.dispatchEvent(new Event('input'));
    expect(dateLabel.textContent).toBe(new Date('2024-05-18').toLocaleDateString());

    document.body.removeChild(dateField.getNode());
  });

  it('Should display error messages correctly', () => {
    jest.spyOn(formField, 'getValue').mockReturnValue('sss');
    formField.updateErrors(['Error 1', 'Error 2']);
    const errorElements = formField['errors'].getNode().querySelectorAll(`.${styles.form__inputError}`);

    expect(errorElements.length).toBe(2);
    expect(errorElements[0].textContent).toBe('Error 1');
    expect(errorElements[1].textContent).toBe('Error 2');

    jest.spyOn(formField, 'getValue').mockReturnValue('');
    formField.updateErrors([]);
    expect(formField.getNode().querySelector(`.${styles.form__inputError}`)?.textContent).toBe('Required');
  });
});
