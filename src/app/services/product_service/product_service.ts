import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';

import AuthService from '@services/auth-service';

class GetProductsService {
  protected root: ByProjectKeyRequestBuilder;

  protected filters: Set<string> = new Set();

  protected sortOrder: string;

  constructor() {
    this.root = AuthService.getRoot();
    this.sortOrder = '';
  }

  public getAllProduct() {
    return this.root
      .productProjections()
      .get({ queryArgs: { limit: 100 } })
      .execute();
  }

  public getCategoty() {
    return this.root.categories().withKey({ key: 'baguettes' }).get().execute();
  }

  public getProductByName(name: string) {
    return this.root.productProjections().withKey({ key: name }).get().execute();
  }

  public applyFilter(filter: string) {
    if (this.filters.has(filter)) {
      this.filters.delete(filter);
    } else {
      this.filters.add(filter);
    }
  }

  public applySort(sortType: string) {
    this.sortOrder = sortType;
  }

  public getFilteredProducts() {
    return this.root
      .productProjections()
      .search()
      .get({
        queryArgs: {
          priceCurrency: 'EUR',
          filter: Array.from(this.filters),
          limit: 100,
          sort: [this.sortOrder],
        },
      })
      .execute();
  }
}

const ProductService = new GetProductsService();
export default ProductService;
