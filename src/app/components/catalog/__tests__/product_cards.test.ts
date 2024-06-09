import type { ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';

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

describe('ProductCards', () => {
  let products: ProductCards;
  let router: Router;
  let catalogView: CatalogView;

  beforeEach(() => {
    router = new Router(routes);
    catalogView = new CatalogView(router);
    products = new ProductCards(router, catalogView);
    console.log(router);
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
});
