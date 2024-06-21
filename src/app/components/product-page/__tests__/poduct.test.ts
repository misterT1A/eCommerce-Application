// import type { ProductProjection } from '@commercetools/platform-sdk';

// import * as cardModel from '@components/catalog/card-element/card-model';
import HeaderController from '@components/header/header_controller';
import Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';

import ProductController from '../product-controller';

const routes = [
  { path: '', callBack: jest.fn() },
  { path: 'login', callBack: jest.fn() },
  { path: 'registration', callBack: jest.fn() },
  { path: 'catalog', callBack: jest.fn() },
  { path: 'product', callBack: jest.fn() },
  { path: 'error', callBack: jest.fn() },
];

// const productParam = {
//   masterVariant: {
//     prices: [{ id: '22', value: { centAmount: 300 }, discounted: { value: { centAmount: 200 } } }],
//     images: [{ url: 'url' }],
//   },
//   key: 'key',
//   name: { title: { en: 'title' } },
//   description: { en: 'description' },
// } as unknown as ProductProjection;
// const productParamWithoutDisc = {
//   masterVariant: {
//     prices: [{ id: '22', value: { centAmount: 300 } }],
//     images: [{ url: 'url' }],
//   },
//   key: 'key',
//   name: { title: { en: 'title' } },
//   description: { en: 'description' },
// } as unknown as ProductProjection;

describe('Product Page', () => {
  const router = new Router(routes);
  const headerController = new HeaderController(router);
  let product: ProductController;
  const name = 'bread';
  jest.mock('swiper/bundle/css', jest.fn());

  beforeEach(() => {
    product = new ProductController(router, name, headerController);
  });

  test('should create product page', () => {
    expect(product.getView).toBeInstanceOf(BaseComponent);
  });

  // test('should create product content', () => {
  //   product.getView.setContent(productParam);
  //   expect(product.getView.getChildren.length).toBe(3);
  // });

  // test('should create product content without discount', () => {
  //   product.getView.setContent(productParamWithoutDisc);
  //   expect(product.getView.getChildren.length).toBe(3);
  // });

  // test('should change count when clicked', () => {
  //   const mockEventPlus = { target: { textContent: '+' } };
  //   const mockEventMinus = { target: { textContent: '-' } };

  //   const changeCountSpy = jest.spyOn(cardModel, 'changeCount');
  //   product.getView['handler'](mockEventPlus as unknown as Event);
  //   expect(changeCountSpy).toHaveBeenCalled();
  //   product.getView['handler'](mockEventMinus as unknown as Event);
  //   expect(changeCountSpy).toHaveBeenCalled();
  // });

  // test('should no change count when unknown clicked', () => {
  //   const mockEvent = { target: { textContent: 'Unknown Link' } };

  //   const changeCountSpy = jest.spyOn(cardModel, 'changeCount');
  //   product.getView['handler'](mockEvent as unknown as Event);
  //   expect(changeCountSpy).not.toHaveBeenCalled();
  // });
});
