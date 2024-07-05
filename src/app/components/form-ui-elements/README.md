# Reusable UI form elements

## Checkbox

```ts
const checkbox = new Checkbox('Set this address as billing and shipping.');
checkbox.getValue(); // returns true if checked and false otherwise
```
![checkbox1](https://github.com/misterT1A/eCommerce-Application/assets/72615388/bb45680a-4ce7-4aac-ad67-ea79fb52f780)


## Toggler

```ts
const toggler = new Toggler('Some option');
toggler.getValue(); // returns true if checked and false otherwise
```
![toggler](https://github.com/misterT1A/eCommerce-Application/assets/72615388/43538907-d881-4da9-9a81-30f0d200bd0d)


## FormField

```ts
const firstName = new FormField('First Name', 'text'); // text field
const date = new FormField('Date of Birth', 'date'); // date picker
const password = new FormField('Password', 'password'); // password field, enables password visibility toggler
```
![formField](https://github.com/misterT1A/eCommerce-Application/assets/72615388/810e7b2b-74b4-4a64-bb1b-74b4024672a1)

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
![dropdown1](https://github.com/misterT1A/eCommerce-Application/assets/72615388/8a5748f3-96ce-4803-8426-4f76491ff90d)


```ts
const categories = new FormSelectionMultiple('Categories', ['Bread', 'Pastries', 'Pies', 'Cakes', 'Waffles']);
categories.getValue(); // returns array of selected options
```
![multipledd](https://github.com/misterT1A/eCommerce-Application/assets/72615388/59003d69-0bdb-492e-92bd-425e2d9fba24)



Will be updated...
