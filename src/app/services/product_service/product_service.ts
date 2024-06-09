import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';

import type { CategoryKey, FilterKeys, SortKey } from '@components/catalog/filters/constants-filters';
import { CATEGORIES, FILTERS, SORT, SUBCATEGORIES } from '@components/catalog/filters/constants-filters';
import AuthService from '@services/auth-service';

class GetProductsService {
  protected root: ByProjectKeyRequestBuilder;

  protected filters: Set<string> = new Set();

  protected priceRange: [number, number] = [0, 50000];

  protected priceMaxRange: [number, number] = [0, 50000];

  protected sortOrder = 'price asc';

  protected searchQuery = '';

  protected chosenCategory = '';

  protected DEFAULTCARDSCOUNT = 6;

  protected limitCardsCount = this.DEFAULTCARDSCOUNT;

  protected quantityToAddCount = 3;

  protected cardsCount = 0;

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
    this.sortOrder = 'price asc';
    this.priceRange = this.priceMaxRange;
    this.limitCardsCount = this.DEFAULTCARDSCOUNT;
    this.cardsCount = 0;
  }

  public getDefaultCardsCount() {
    return this.DEFAULTCARDSCOUNT;
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

  public setOffsetCardsCount() {
    if (this.cardsCount < 6) {
      this.cardsCount += this.DEFAULTCARDSCOUNT;
      return this.cardsCount + this.quantityToAddCount;
    }
    this.cardsCount += this.quantityToAddCount;
    return this.cardsCount + this.quantityToAddCount;
  }

  public setDefaultCardsCount(count: number) {
    this.limitCardsCount = count;
  }

  public resetDefaultCardsCount() {
    this.limitCardsCount = this.DEFAULTCARDSCOUNT;
    this.cardsCount = 0;
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

  public getFilteredProducts(isAddNewCards = false) {
    const filtersQuery = Array.from(this.filters);
    const facet = [`variants.price.centAmount:range(0 to 100000)`];
    if (this.chosenCategory) {
      filtersQuery.push(`categories.id:subtree("${this.chosenCategory}")`);
    }

    filtersQuery.push(this.getPriceFilter());

    const params = {
      priceCurrency: 'EUR',
      filter: filtersQuery,
      limit: this.limitCardsCount,
      offset: 0,
      sort: [this.sortOrder],
      'text.en': this.searchQuery,
      fuzzy: true,
      facet,
    };

    if (isAddNewCards) {
      if (this.limitCardsCount > this.DEFAULTCARDSCOUNT) {
        this.cardsCount = this.limitCardsCount;
      }
      this.limitCardsCount = this.quantityToAddCount;
      params.limit = this.limitCardsCount;
      params.offset = this.cardsCount;
    }

    return this.root
      .productProjections()
      .search()
      .get({
        queryArgs: params,
      })
      .execute();
  }
}

const ProductService = new GetProductsService();
export default ProductService;
