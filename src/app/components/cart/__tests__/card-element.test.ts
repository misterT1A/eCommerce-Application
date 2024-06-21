import type { LineItem } from '@commercetools/platform-sdk';

import HeaderController from '@components/header/header_controller';
import Router from '@src/app/router/router';

import Card from '../card-element/card-element';
import CartView from '../cart-view';

const routes = [
  { path: '', callBack: jest.fn() },
  { path: 'login', callBack: jest.fn() },
  { path: 'registration', callBack: jest.fn() },
  { path: 'error', callBack: jest.fn() },
];

const cardProps = {
  variant: { images: [{ url: 'url' }] },
  price: { discounted: { value: { centAmount: 4 } }, value: { centAmount: 4 } },
  key: 'key',
  id: 'kjhkjhkjh',
  name: { en: 'title' },
  description: { en: 'description' },
} as unknown as LineItem;

describe('Catalog card element', () => {
  const router = new Router(routes);

  const header = new HeaderController(router);
  const cart = new CartView(router, header);

  let card: Card;

  beforeEach(() => {
    card = new Card(cardProps, cart);
  });

  it('should return img', () => {
    const img = card['setCardImg']('url');
    expect(img.getNode().tagName).toBe('DIV');
  });

  it('should remove card', () => {
    card['remove']();
    setTimeout(() => expect(card).toBeUndefined(), 600);
  });

  it('should set discount price', () => {
    const block = card['setDescription']();
    expect(block.getChildren[1].getChildren[0].getNode().tagName).toBe('P');
  });
});
