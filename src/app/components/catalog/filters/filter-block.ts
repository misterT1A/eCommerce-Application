import type { ClientResponse, ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';

import FormField from '@components/form-ui-elements/formField';
import FormSelection from '@components/form-ui-elements/formSelection';
import Toggler from '@components/form-ui-elements/formToggler';
import type RangeSelector from '@components/form-ui-elements/range-selector';
import ProductService from '@services/product_service/product_service';
import type Router from '@src/app/router/router';
import { isCountCards } from '@src/app/router/router-helpers';
import BaseComponent from '@utils/base-component';
import { button, div } from '@utils/elements';
import { sortProducts, transformCategoryName, transformCategoryNamesForView } from '@utils/filters-helpers';

import styles from './_filters.scss';
import type { FilterKeys, SortKey } from './constants-filters';
import { CATALOG_ROOT, CATEGORIES, SORT, SUBCATEGORIES } from './constants-filters';
import {
  SORT_SELECTION,
  getPriceFilter,
  getPriceFromUrl,
  getPriceSelector,
  getSortSelector,
  isPriceFilter,
  updatePriceRange,
} from './price-filter-helpers';
import type Breadcrumbs from '../breadcrumbs/breadcrumbs';
import type ProductCards from '../product-cards/product-cards';

export default class FilterBlock extends BaseComponent {
  public filters: BaseComponent;

  private closeButton: BaseComponent<HTMLButtonElement>;

  private resetButton: BaseComponent<HTMLButtonElement>;

  private searchForm: BaseComponent<HTMLFormElement>;

  private searchInput: FormField;

  private categorySelect: FormSelection;

  private subcategorySelect: FormSelection;

  private salesFilter: Toggler;

  private veganFilter: Toggler;

  private forKidsFilter: Toggler;

  private sortSelection: FormSelection;

  private priceFilter: RangeSelector;

  constructor(
    private productCardsBlock: ProductCards,
    private breadcrumbs: Breadcrumbs,
    private router: Router,
    private scrollControl: IScrollController
  ) {
    super({ tag: 'div', className: styles.overlay });
    this.filters = div([styles.filterBlock]);
    this.resetButton = button([styles['reset-btn']], 'RESET FILTERS', {
      onclick: () => this.reset(),
    });
    this.closeButton = button([styles['close-btn']], '', {
      onclick: () => {
        this.filters.removeClass(styles['filterBlock--visible']);
        this.removeClass(styles['overlay--visible']);
        this.scrollControl.unlock();
      },
    });
    this.searchForm = new BaseComponent<HTMLFormElement>(
      { tag: 'form', action: '#' },
      (this.searchInput = new FormField('', 'search', false))
    );
    this.categorySelect = new FormSelection('Category', [...transformCategoryNamesForView(Object.keys(CATEGORIES))]);
    this.subcategorySelect = new FormSelection('Subcategory', []);
    this.subcategorySelect.addClass(styles.inactive);
    this.salesFilter = new Toggler('On sale');
    this.veganFilter = new Toggler('Vegan');
    this.priceFilter = getPriceSelector();
    this.forKidsFilter = new Toggler('For kids');
    this.sortSelection = getSortSelector();
    this.filters.appendChildren([
      this.closeButton,
      this.resetButton,
      this.searchForm,
      this.categorySelect,
      this.subcategorySelect,
      this.sortSelection,
      this.priceFilter,
      this.salesFilter,
      this.veganFilter,
      this.forKidsFilter,
    ]);
    this.initListeners();
    this.append(this.filters);
  }

  private initListeners() {
    this.searchForm.addListener('submit', (e) => {
      e.preventDefault();
      if (!this.searchInput.getValue()) {
        return;
      }
      this.handleSearch(this.searchInput.getValue());
    });
    this.searchInput.input.addListener('input', () => {
      if (!this.searchInput.getValue()) {
        this.handleSearch('');
      }
    });
    this.categorySelect.addListener('change', () => this.handleCategoryChange());
    this.salesFilter.addListener('change', () => this.handleFiltersChange('IS_SALE'));
    this.veganFilter.addListener('change', () => this.handleFiltersChange('IS_VEGAN'));
    this.forKidsFilter.addListener('change', () => this.handleFiltersChange('IS_KIDS'));
    this.sortSelection.addListener('change', () => {
      this.handleSortChange(sortProducts(this.sortSelection.getValue()));
    });
    this.priceFilter.addListener('change', () => this.handlePriceRangeChange());
  }

  public async reset() {
    this.updateView();
    ProductService.resetFilters();
    await ProductService.getFilteredProducts().then((data) => this.productCardsBlock.setProducts(data.body));
    this.breadcrumbs.update([CATALOG_ROOT]);
    this.router.setEmptyUrlCatalog();
    this.filters.removeClass(styles.blur);
  }

  private updateView() {
    this.filters.addClass(styles.blur);
    [this.salesFilter, this.veganFilter, this.forKidsFilter].forEach((filter) => filter.setValue(false));
    [this.searchInput, this.categorySelect, this.subcategorySelect, this.sortSelection, this.priceFilter].forEach(
      (select) => select.reset()
    );
    this.subcategorySelect.addClass(styles.inactive);
  }

  public updatePriceRange(data: ClientResponse<ProductProjectionPagedSearchResponse>) {
    updatePriceRange(data);
    this.priceFilter.updateRange(ProductService.priceBounds);
  }

  private handleSearch(query: string) {
    ProductService.setSearchQuery(query);
    ProductService.getFilteredProducts().then((data) => this.productCardsBlock.setProducts(data.body));
  }

  private categoryChange() {
    const categoryID = CATEGORIES[transformCategoryName(this.categorySelect.getValue())];
    const subcategoryKeys = Object.keys(SUBCATEGORIES).filter((el) => SUBCATEGORIES[el].parentId === categoryID) ?? '';

    if (!subcategoryKeys.length) {
      this.subcategorySelect.reset();
      this.subcategorySelect.addClass(styles.inactive);
    } else {
      this.subcategorySelect.destroy();
      this.subcategorySelect = new FormSelection('Subcategory', transformCategoryNamesForView(subcategoryKeys));
      this.subcategorySelect.addListener('change', () => this.handleSubcategoryChange());
      this.categorySelect.getNode().insertAdjacentElement('afterend', this.subcategorySelect.getNode());
    }
    this.breadcrumbs.update([CATALOG_ROOT, this.categorySelect.getValue()]);

    ProductService.setChosenCategory(categoryID);
  }

  public handleCategoryChange() {
    if (!this.isCategoryChosen()) {
      return;
    }
    this.setDefaultCardsCount();

    this.categoryChange();
    const categoryID = CATEGORIES[transformCategoryName(this.categorySelect.getValue())];
    const categoryKey = Object.keys(CATEGORIES).find((key) => CATEGORIES[key] === categoryID) ?? '';
    this.router.setUrlCatalog(categoryKey);
    ProductService.getFilteredProducts().then((data) => this.productCardsBlock.setProducts(data.body));
  }

  public handlePriceRangeChange() {
    ProductService.setPriceRange(this.priceFilter.getValue());
    ProductService.getFilteredProducts().then((data) => this.productCardsBlock.setProducts(data.body));
    this.router.setUrlCatalog(getPriceFilter());
  }

  private handleSubcategoryChange() {
    this.setDefaultCardsCount();

    this.router.setUrlCatalog(transformCategoryName(this.subcategorySelect.getValue()));

    this.breadcrumbs.update([CATALOG_ROOT, this.categorySelect.getValue(), this.subcategorySelect.getValue()]);
    const subcategoryID = SUBCATEGORIES[transformCategoryName(this.subcategorySelect.getValue())];
    ProductService.setChosenCategory(subcategoryID.id);

    ProductService.getFilteredProducts().then((data) => this.productCardsBlock.setProducts(data.body));
  }

  private isCategoryChosen() {
    return this.categorySelect.getValue();
  }

  private handleFiltersChange(filterValue: FilterKeys) {
    ProductService.applyFilter(filterValue);
    ProductService.getFilteredProducts().then((data) => this.productCardsBlock.setProducts(data.body));
    this.router.setUrlCatalog(filterValue);
  }

  private handleSortChange(value: SortKey) {
    ProductService.applySort(value);
    ProductService.getFilteredProducts().then((data) => this.productCardsBlock.setProducts(data.body));
    this.router.setUrlCatalog(value);
  }

  public setValues(values: string[]) {
    if (values.some((value) => value in CATEGORIES)) {
      const validValue = values.find((value) => value in CATEGORIES);
      if (validValue) {
        const selectValue = String(transformCategoryNamesForView([validValue]));
        this.categorySelect.setValue(selectValue);
        this.categoryChange();
      }
    }
    if (values.some((value) => value in SUBCATEGORIES)) {
      const validValue = values.find((value) => value in SUBCATEGORIES);
      if (validValue) {
        const selectValue = String(transformCategoryNamesForView([validValue]));
        this.subcategorySelect.setValue(selectValue);
        this.breadcrumbs.update([CATALOG_ROOT, this.categorySelect.getValue(), this.subcategorySelect.getValue()]);
        const subcategoryID = SUBCATEGORIES[transformCategoryName(this.subcategorySelect.getValue())];
        ProductService.setChosenCategory(subcategoryID.id);
      }
    }
    if (values.some((value) => value in SORT)) {
      const validValue = values.find((value) => value in SORT) as SortKey;
      if (validValue) {
        this.sortSelection.setValue(SORT_SELECTION[validValue as keyof typeof SORT_SELECTION]);
        ProductService.applySort(validValue);
      }
    }
    if (values.includes('IS_VEGAN')) {
      this.veganFilter.setValue(true);
      ProductService.applyFilter('IS_VEGAN');
    }
    if (values.includes('IS_KIDS')) {
      this.forKidsFilter.setValue(true);
      ProductService.applyFilter('IS_KIDS');
    }
    if (values.includes('IS_SALE')) {
      this.salesFilter.setValue(true);
      ProductService.applyFilter('IS_SALE');
    }
    const priceFilter = values.find((el) => isPriceFilter(el));
    if (priceFilter) {
      ProductService.setPriceRange(getPriceFromUrl(priceFilter));
    }
    if (values.includes(CATALOG_ROOT)) {
      ProductService.resetFilters();
      this.reset();
      this.categoryChange();
      this.breadcrumbs.update([CATALOG_ROOT]);
    }

    this.checkCardsCount(values);

    ProductService.getFilteredProducts().then((data) => {
      this.productCardsBlock.setProducts(data.body);
      this.updatePriceRange(data);
      this.priceFilter.setValue(ProductService.getPriceRange());
    });
  }

  private checkCardsCount(values: string[]) {
    const filter = values.filter((elem) => isCountCards(elem)).join('');
    const count = filter.replace(/\D/g, '');
    if (count) {
      ProductService.setDefaultCardsCount(+count);
    } else {
      ProductService.resetDefaultCardsCount();
    }
  }

  private setDefaultCardsCount() {
    ProductService.resetDefaultCardsCount();
    this.router.setEmptyCardsCountURL();
  }
}
