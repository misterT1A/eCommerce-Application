import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';

import type { CategoryKey, FilterKeys, SortKey } from '@components/catalog/filters/constants-filters';
import { CATEGORIES, FILTERS, SORT, SUBCATEGORIES } from '@components/catalog/filters/constants-filters';
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
          const categoryKey = result.key as string;
          const categoryId = result.id;
          CATEGORIES[categoryKey] = categoryId;
        } else {
          const categoryKey = result.key as string;
          const categoryId = result.id;
          SUBCATEGORIES[categoryKey] = { id: categoryId, parentId: result.parent?.id as string };
        }
      });
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

  public applyFilter(filter: FilterKeys) {
    const filterValue = FILTERS[filter];
    if (this.filters.has(filterValue)) {
      this.filters.delete(filterValue);
    } else {
      this.filters.add(filterValue);
    }
  }

  public applySort(sortType: SortKey) {
    this.sortOrder = SORT[sortType];
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
