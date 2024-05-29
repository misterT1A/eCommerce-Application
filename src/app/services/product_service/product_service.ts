import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';

import type { CategoryKey } from '@components/catalog/filters/constants-filters';
import { CATEGORIES, SUBCATEGORIES } from '@components/catalog/filters/constants-filters';
import AuthService from '@services/auth-service';

class GetProductsService {
  protected root: ByProjectKeyRequestBuilder;

  protected filters: Set<string> = new Set();

  protected sortOrder = '';

  protected searchQuery = '';

  protected chosenCategory = '';

  constructor() {
    this.root = AuthService.getRoot();
  }

  public setChosenCategory(category: string) {
    this.chosenCategory = category;
  }

  public async getCommercetoolsData() {
    try {
      const data = await this.getCategories();
      const { results } = data.body;
      if (!results) {
        return;
      }

      results.forEach((result) => {
        if (!result.ancestors.length) {
          const categoryKey = result.key?.toUpperCase().replace('-', ' ').replace('_', ' & ') as string;
          const categoryId = result.id;
          CATEGORIES[categoryKey] = categoryId;
        } else {
          const categoryKey = result.key?.replace('-', ' ').replace('_', ' & ') as string;
          const categoryId = result.id;
          SUBCATEGORIES[categoryKey] = categoryId;
        }
      });
      // console.log('Updated CATEGORIES:', CATEGORIES);
      // console.log('Updated SUBCATEGORIES:', SUBCATEGORIES);
    } catch (e) {
      console.error('Error:', e);
    }
  }

  public async getSubcategories(categoryId: CategoryKey) {
    return this.root
      .categories()
      .get({
        queryArgs: {
          where: `parent(id="${categoryId}")`,
        },
      })
      .execute();
  }

  public getAllProduct() {
    return this.root
      .productProjections()
      .get({ queryArgs: { limit: 100 } })
      .execute();
  }

  public getCategories() {
    return this.root.categories().get().execute();
  }

  public getProductByName(name: string) {
    return this.root.productProjections().withKey({ key: name }).get().execute();
  }

  public resetFilters() {
    this.filters.clear();
    this.chosenCategory = '';
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
    const filtersQuery = Array.from(this.filters);
    if (this.chosenCategory) {
      filtersQuery.push(`categories.id:subtree("${this.chosenCategory}")`);
    }

    return this.root
      .productProjections()
      .search()
      .get({
        queryArgs: {
          priceCurrency: 'EUR',
          filter: filtersQuery,
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
