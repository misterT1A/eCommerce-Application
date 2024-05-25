import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';

import AuthService from '@services/auth-service';

class GetProductsService {
  protected root: ByProjectKeyRequestBuilder;

  constructor() {
    this.root = AuthService.getRoot();
  }

  public getAllProduct() {
    return this.root
      .productProjections()
      .get({ queryArgs: { limit: 100 } })
      .execute();
  }

  public getCategoty() {
    // return this.root
    //   .productProjections()
    //   .search()
    //   // .get({ queryArgs: { filter: `categories.id:subtree("not-sweets")` } })
    //   .get({queryArgs: {}})
    //   .execute();

    return this.root.categories().withKey({ key: 'baguettes' }).get().execute();
  }

  public getProductByName(name: string) {
    return this.root.products().withKey({ key: name }).get().execute();
  }

  public getFilteredProducts(attr?: string[], sort?: string[]) {
    const arr = [];
    if (attr) {
      arr.push(...attr);
    }
    return this.root
      .productProjections()
      .search()
      .get({
        queryArgs: {
          priceCurrency: 'EUR',
          filter: arr,
          limit: 100,
          sort,
        },
      })
      .execute();
  }
}

const ProductService = new GetProductsService();
export default ProductService;
