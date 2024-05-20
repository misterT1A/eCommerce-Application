import AddressField from '../addressField';
import Checkbox from '../formCheckbox';
import FormField from '../formField';
import FormSelection from '../formSelection';

describe('AddressField', () => {
  let addressField: AddressField;

  beforeEach(() => {
    addressField = new AddressField();
  });

  it('Should initialize and render all address fields', () => {
    expect(addressField.fields.defaultAddress).toBeInstanceOf(Checkbox);
    expect(addressField.fields.commonAddress).toBeInstanceOf(Checkbox);
    expect(addressField.fields.city).toBeInstanceOf(FormField);
    expect(addressField.fields.street).toBeInstanceOf(FormField);
    expect(addressField.fields.country).toBeInstanceOf(FormSelection);
    expect(addressField.fields.zipCode).toBeInstanceOf(FormField);

    document.body.appendChild(addressField.getNode());
    expect(document.body.contains(addressField.fields.defaultAddress.getNode())).toBe(true);
    expect(document.body.contains(addressField.fields.commonAddress.getNode())).toBe(true);
    expect(document.body.contains(addressField.fields.city.getNode())).toBe(true);
    expect(document.body.contains(addressField.fields.street.getNode())).toBe(true);
    expect(document.body.contains(addressField.fields.country.getNode())).toBe(true);
    expect(document.body.contains(addressField.fields.zipCode.getNode())).toBe(true);
    document.body.removeChild(addressField.getNode());
  });

  it('Should return the correct fields values from getValue', () => {
    jest.spyOn(addressField.fields.defaultAddress, 'getValue').mockReturnValue(true);
    jest.spyOn(addressField.fields.commonAddress, 'getValue').mockReturnValue(false);
    jest.spyOn(addressField.fields.city, 'getValue').mockReturnValue('London');
    jest.spyOn(addressField.fields.street, 'getValue').mockReturnValue('Street');
    jest.spyOn(addressField.fields.country, 'getValue').mockReturnValue('UK');
    jest.spyOn(addressField.fields.zipCode, 'getValue').mockReturnValue('123 465');

    const expectedValues = {
      defaultAddress: true,
      commonAddress: false,
      city: 'London',
      street: 'Street',
      country: 'UK',
      zipCode: '123 465',
    };

    expect(addressField.getValue()).toEqual(expectedValues);
  });
});
