import Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';

import Card from '../card-element/card-element-view';
import * as cardModel from '../card-element/card-model';

const routes = [
  { path: '', callBack: jest.fn() },
  { path: 'login', callBack: jest.fn() },
  { path: 'registration', callBack: jest.fn() },
  { path: 'error', callBack: jest.fn() },
];

describe('Catalog card element', () => {
  const router = new Router(routes);
  let card: Card;

  const props: ICardProps = {
    key: 'key',
    id: 'kjhkjhkjh',
    img: [{ url: 'url' }],
    title: 'title',
    description: 'description',
    price: { value: { centAmount: 4 } },
  };

  beforeEach(() => {
    card = new Card(props, router);
  });

  test('should create card Element', () => {
    expect(card).toBeInstanceOf(BaseComponent);
  });

  test('should navigate to product page', () => {
    const mockEvent = { target: { dataset: { name: 'read-more-button' } } };

    const navigate = jest.spyOn(router, 'navigateToProduct').mockImplementation(jest.fn());
    card['handler'](mockEvent as unknown as Event);
    expect(navigate).toHaveBeenCalled();
  });

  test('should not navigate for unknown link', () => {
    const mockEvent = { target: { dataset: { name: 'Unknown Link' } } };

    const navigate = jest.spyOn(router, 'navigateToProduct').mockImplementation(jest.fn());
    card['handler'](mockEvent as unknown as Event);
    expect(navigate).not.toHaveBeenCalled();
  });

  test('should return description', () => {
    const text = 'testtesttesttesttesttesttesttest';
    const text2 = 'test';
    const text3 = undefined;
    const result = cardModel.setShortDescription(text);
    expect(result.length === 33).toBe(true);
    const result2 = cardModel.setShortDescription(text2);
    expect(result2.length === 4).toBe(true);
    const result3 = cardModel.setShortDescription(text3);
    expect(result3).toBe('No description');
  });

  test('should return price', () => {
    const text = 400;
    const text2 = undefined;
    const result = cardModel.setPrice(text);
    expect(result).toBe('4.00 €');
    const result2 = cardModel.setPrice(text2);
    expect(result2).toBe('Not for sale');
  });
});
