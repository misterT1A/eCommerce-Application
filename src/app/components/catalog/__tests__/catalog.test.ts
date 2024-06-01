import Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';

import Card from '../card-element/card-element-view';
import * as cardModel from '../card-element/card-model';
import CatalogView from '../catalog-view';
import FilterBlock from '../filters/filter-block';
import ProductCards from '../product-cards/product-cards';

const routes = [
  { path: '', callBack: jest.fn() },
  { path: 'login', callBack: jest.fn() },
  { path: 'registration', callBack: jest.fn() },
  { path: 'error', callBack: jest.fn() },
];

describe('Catalog', () => {
  const router = new Router(routes);
  let view: CatalogView;

  beforeEach(() => {
    view = new CatalogView(router);
  });

  test('should get content view', () => {
    expect(view['getProductCardView']).toBeInstanceOf(ProductCards);
    expect(view['getFilterBlockView']).toBeInstanceOf(FilterBlock);
    expect(view['getRouter']).toBeInstanceOf(Router);
  });
});

describe('Catalog card element', () => {
  const router = new Router(routes);
  let card: Card;

  const props: ICardProps = {
    key: 'key',
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

  test('should change count when clicked', () => {
    const mockEventPlus = { target: { textContent: '+' } };
    const mockEventMinus = { target: { textContent: '-' } };

    const changeCountSpy = jest.spyOn(cardModel, 'changeCount');
    card['handler'](mockEventPlus as unknown as Event);
    expect(changeCountSpy).toHaveBeenCalled();
    card['handler'](mockEventMinus as unknown as Event);
    expect(changeCountSpy).toHaveBeenCalled();
  });

  test('should navigate to product page', () => {
    const mockEvent = { target: { textContent: 'READ MORE' } };

    const navigate = jest.spyOn(router, 'navigateToProduct').mockImplementation(jest.fn());
    card['handler'](mockEvent as unknown as Event);
    expect(navigate).toHaveBeenCalled();
  });

  test('should not navigate for unknown link', () => {
    const mockEvent = { target: { textContent: 'Unknown Link' } };

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

  describe('changeCount', () => {
    let countParrent: HTMLElement;

    beforeEach(() => {
      countParrent = document.createElement('div');
      countParrent.innerHTML = '<span></span><span>5</span>';
    });

    it('should do nothing if countParrent is null', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();
      cardModel.changeCount(null, true);
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should increment the count if plus is true', () => {
      cardModel.changeCount(countParrent, true);
      const countElem = countParrent.children[1];
      expect(countElem.textContent).toBe('6');
    });

    it('should decrement the count if plus is false and count is greater than 1', () => {
      cardModel.changeCount(countParrent, false);
      const countElem = countParrent.children[1];
      expect(countElem.textContent).toBe('4');
    });

    it('should not decrement the count if plus is false and count is 1', () => {
      countParrent.children[1].textContent = '1';
      cardModel.changeCount(countParrent, false);
      const countElem = countParrent.children[1];
      expect(countElem.textContent).toBe('1');
    });

    it('should not change the count if count is empty', () => {
      countParrent.children[1].textContent = '';
      cardModel.changeCount(countParrent, true);
      const countElem = countParrent.children[1];
      expect(countElem.textContent).toBe('');
    });
  });
});
