# Reusable UI form elements

## Checkbox

```ts
const checkbox = new Checkbox('Set this address as billing and shipping.');
checkbox.getValue(); // returns true if checked and false otherwise
```

## Toggler

```ts
const toggler = new Toggler('Some option');
toggler.getValue(); // returns true if checked and false otherwise
```

## FormField

```ts
const firstName = new FormField('First Name', 'text'); // text field
const date = new FormField('Date of Birth', 'date'); // date picker
const password = new FormField('Password', 'password'); // password field, enables password visibility toggler
```

```ts
firstName.getValue(); // returns string -- value of associated text input
```

```ts
firstName.updateErrors(errors); // shows errors -- array of strings (error messages);
```

## FormSelection and FormSelectionMultiple

These components allow users to select one or multiple options from a predefined list.

```ts
const country = new FormSelection('Country', ['UK', 'France', 'Belgium']);
country.getValue(); // returns selected option
```

```ts
const categories = new FormSelectionMultiple('Categories', ['Bread', 'Pastries', 'Pies', 'Cakes', 'Waffles']);
categories.getValue(); // returns array of selected options
```

Will be updated...
