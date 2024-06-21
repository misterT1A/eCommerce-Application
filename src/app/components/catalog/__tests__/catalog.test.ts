import HeaderController from '@components/header/header_controller';
import Router from '@src/app/router/router';

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
  const headerController = new HeaderController(router);
  let view: CatalogView;

  beforeEach(() => {
    view = new CatalogView(router, headerController);
  });

  test('should get content view', () => {
    expect(view['getProductCardView']).toBeInstanceOf(ProductCards);
    expect(view['getFilterBlock']).toBeInstanceOf(FilterBlock);
    expect(view['getRouter']).toBeInstanceOf(Router);
  });
});
