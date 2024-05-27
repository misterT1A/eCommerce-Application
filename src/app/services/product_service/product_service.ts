import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';

import AuthService from '@services/auth-service';

class GetProductsService {
  protected root: ByProjectKeyRequestBuilder;

  protected filters: Set<string> = new Set();

  protected sortOrder = '';

  protected searchQuery = '';

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
    return this.root.categories().withKey({ key: 'baguettes' }).get().execute();
  }

  //   public getProductsByCategory() {
  //   this.root
  //   .productProjections()
  //   .search()
  //   .get({queryArgs: {
  // ... filter.query: categories.id:subtree("id")...
  // }})
  //   }

  public getProductByName(name: string) {
    return this.root.productProjections().withKey({ key: name }).get().execute();
  }

  public resetFilters() {
    this.filters.clear();
    this.searchQuery = '';
    this.sortOrder = '';
    return this.getFilteredProducts();
  }

  public setSearchQuery(query: string) {
    this.searchQuery = query;
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
          'text.en': this.searchQuery,
          fuzzy: true,
        },
      })
      .execute();
  }
}

const ProductService = new GetProductsService();
export default ProductService;
