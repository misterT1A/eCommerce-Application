import type { ProductProjection, ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';

import HeaderController from '@components/header/header_controller';
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

  it('should create cards', () => {
    products['createCards']([cardProps, cardProps]);

    const count = products.getChildren.length;

    expect(count).toBe(2);
  });
});
