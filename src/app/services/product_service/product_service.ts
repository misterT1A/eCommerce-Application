import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';

import AuthService from '@services/auth-service';

class GetProductsService {
  protected root: ByProjectKeyRequestBuilder;

  protected filters: Set<string>;

  protected sortOrder: string;

  constructor() {
    this.root = AuthService.getRoot();
    this.filters = new Set();
    this.sortOrder = '';
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

  public applyFilter(filter: string) {
    if (this.filters.has(filter)) {
      this.filters.delete(filter);
    } else {
      this.filters.add(filter);
    }
  }

  public setSort(sortType: string) {
    this.sortOrder = sortType;
  }

  public getFilteredProducts() {
    // const filtersArr = [];
    // if (this.filters) {
    //   filtersArr.push(this.filters);
    // }
    return this.root
      .productProjections()
      .search()
      .get({
        queryArgs: {
          priceCurrency: 'EUR',
          filter: Array.from(this.filters),
          limit: 100,
          // sort: this.sortOrder,
        },
      })
      .execute();
  }

  // public getFilteredProducts(attr?: string[], sort?: string[]) {
  //   const arr = [];
  //   if (attr) {
  //     arr.push(...attr);
  //   }
  //   return this.root
  //     .productProjections()
  //     .search()
  //     .get({
  //       queryArgs: {
  //         priceCurrency: 'EUR',
  //         filter: arr,
  //         limit: 100,
  //         sort,
  //       },
  //     })
  //     .execute();
  // }
}

const ProductService = new GetProductsService();
export default ProductService;
