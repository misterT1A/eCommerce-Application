import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';

import type { CategoryKey, FilterKeys, SortKey } from '@components/catalog/filters/constants-filters';
import { CATEGORIES, FILTERS, SORT, SUBCATEGORIES } from '@components/catalog/filters/constants-filters';
import AuthService from '@services/auth-service';

class GetProductsService {
  protected root: ByProjectKeyRequestBuilder;

  protected filters: Set<string> = new Set();

  protected priceRange: [number, number] = [0, 50000];

  protected priceMaxRange: [number, number] = [0, 50000];

  protected sortOrder = '';

  protected searchQuery = '';

  protected chosenCategory = '';

  constructor() {
    this.root = AuthService.getRoot();
  }

  public setChosenCategory(category: string) {
    if (!category) {
      this.chosenCategory = '';
    }
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
    this.priceRange = this.priceMaxRange;
  }

  public setPriceRange(range: [number, number]) {
    this.priceRange = range;
  }

  public setPriceMaxRange(range: [number, number]) {
    this.priceMaxRange = range;
  }

  public get priceBounds() {
    return this.priceMaxRange;
  }

  public getPriceRange() {
    return this.priceRange;
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

  public getPriceFilter() {
    return `variants.price.centAmount:range (${this.priceRange[0]} to ${this.priceRange[1]})`;
  }

  public applySort(sortType: SortKey) {
    this.sortOrder = SORT[sortType];
  }

  public getFilteredProducts() {
    const filtersQuery = Array.from(this.filters);
    const facet = [`variants.price.centAmount:range(0 to 100000)`];
    if (this.chosenCategory) {
      filtersQuery.push(`categories.id:subtree("${this.chosenCategory}")`);
    }

    filtersQuery.push(this.getPriceFilter());

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
          facet,
        },
      })
      .execute();
  }
}

const ProductService = new GetProductsService();
export default ProductService;
