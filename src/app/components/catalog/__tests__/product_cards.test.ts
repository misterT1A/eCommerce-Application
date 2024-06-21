import type { ProductProjection, ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';

import HeaderController from '@components/header/header_controller';
import * as actions from '@services/cart-service/cart-actions';
import Router from '@src/app/router/router';

import CatalogView from '../catalog-view';
import ProductCards from '../product-cards/product-cards';

const routes = [
  { path: '', callBack: jest.fn() },
  { path: 'login', callBack: jest.fn() },
  { path: 'registration', callBack: jest.fn() },
  { path: 'catalog', callBack: jest.fn() },
  { path: 'product', callBack: jest.fn() },
  { path: 'error', callBack: jest.fn() },
];

const cardProps = {
  masterVariant: { prices: [{ value: { centAmount: 4 } }], images: [{ url: 'url' }] },
  key: 'key',
  id: 'kjhkjhkjh',
  name: { en: 'title' },
  description: { en: 'description' },
  isSelected: true,
  count: 5,
} as unknown as ProductProjection;

describe('ProductCards', () => {
  let products: ProductCards;
  let router: Router;
  let catalogView: CatalogView;
  let headerController: HeaderController;

  beforeEach(() => {
    router = new Router(routes);

    headerController = new HeaderController(router);
    catalogView = new CatalogView(router, headerController);
    products = new ProductCards(router, catalogView, headerController);
  });

  it('should show not found title', async () => {
    const showNotFoundSpy = jest.spyOn(products, 'showNotFoundTitle').mockImplementation(jest.fn());
    const body = { results: [] } as unknown as ProductProjectionPagedSearchResponse;

    const hideBlockPromise = new Promise<void>((resolve) => {
      products.setProducts(body);

      setTimeout(() => {
        resolve();
      }, 200);
    });
    await hideBlockPromise;

    products.setProducts(body);

    expect(showNotFoundSpy).toHaveBeenCalled();

    showNotFoundSpy.mockRestore();
  });

  it('should create cards', () => {
    products['createCards']([cardProps, cardProps]);

    const count = products.getChildren.length;

    expect(count).toBe(2);
  });

  it('sholt update products in cart when input changed', async () => {
    const setCartCount = jest.spyOn(headerController, 'setCartCount');
    const updateSpy = jest
      .spyOn(actions, 'updateProductsInCart')
      .mockResolvedValue(Promise.resolve({ success: true, actions: undefined }));
    products['createCards']([cardProps, cardProps]);
    const card = products.getChildren[0];

    const event = new Event('input', {
      bubbles: true,
      cancelable: true,
    });

    card.getNode().dispatchEvent(event);

    await function wait() {
      expect(updateSpy).toHaveBeenCalledWith({ productID: cardProps.id, count: 0 });
      expect(setCartCount).toHaveBeenCalled();
    };

    updateSpy.mockRestore();
  });

  it('should create product cards when setProducts is called with products', async () => {
    const mockProducts = [cardProps, cardProps];
    const mockResponse = {
      results: [cardProps, cardProps],
      count: 2,
      offset: 0,
      total: 2,
    } as unknown as ProductProjectionPagedSearchResponse;
    const showNotFoundSpy = jest.spyOn(products, 'createCards').mockImplementation(jest.fn());

    await products.setProducts(mockResponse);
    await setTimeout(() => expect(showNotFoundSpy).toHaveBeenCalledWith(mockProducts), 500);
  });

  it('should create add button', () => {
    products['setAddButton']();
    const btn = products.getChildren[products.getChildren.length - 1];
    setTimeout(() => expect(btn.getNode().tagName).toBe('button'), 500);
  });

  it('should destroy add button', () => {
    products['setAddButton']();
    products['destroyAddButton']();
    const btn = products.getChildren[products.getChildren.length - 1];
    setTimeout(() => expect(btn.getNode().tagName).toBeUndefined, 500);
  });
});
