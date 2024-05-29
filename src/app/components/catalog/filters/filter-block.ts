import FormField from '@components/form-ui-elements/formField';
import FormSelection from '@components/form-ui-elements/formSelection';
import Toggler from '@components/form-ui-elements/formToggler';
import ProductService from '@services/product_service/product_service';
import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { button } from '@utils/elements';
import { sortProducts, transformCategoryName, transformCategoryNamesForView } from '@utils/filters-helpers';

import styles from './_filters.scss';
import type { FilterKeys, SortKey } from './constants-filters';
import { CATEGORIES, SORT, SUBCATEGORIES } from './constants-filters';
import type Breadcrumbs from '../breadcrumbs/breadcrumbs';
import type ProductCards from '../product-cards/product-cards';

enum SORT_SELECTION {
  TITLE = 'Sort By',
  PRICE_DESC = 'Descending price',
  PRICE_ASC = 'Ascending price',
  A_Z = 'A-Z',
  Z_A = 'Z-A',
}

export default class FilterBlock extends BaseComponent {
  private resetButton: BaseComponent<HTMLButtonElement>;

  private searchForm: BaseComponent<HTMLFormElement>;

  private searchInput: FormField;

  private categorySelect: FormSelection;

  private subcategorySelect: FormSelection;

  private salesFilter: Toggler;

  private veganFilter: Toggler;

  private forKidsFilter: Toggler;

  private sortSelection: FormSelection;

  constructor(
    private productCardsBlock: ProductCards,
    private breadcrumbs: Breadcrumbs,

    private router: Router
  ) {
    super({ tag: 'div', className: styles.filterBlock });
    this.resetButton = button([styles['reset-btn']], 'RESET FILTERS', {
      onclick: () => {
        this.reset();
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
    this.forKidsFilter = new Toggler('For kids');
    this.sortSelection = new FormSelection(SORT_SELECTION.TITLE, [
      SORT_SELECTION.PRICE_DESC,
      SORT_SELECTION.PRICE_ASC,
      SORT_SELECTION.A_Z,
      SORT_SELECTION.Z_A,
    ]);
    this.appendChildren([
      this.resetButton,
      this.searchForm,
      this.categorySelect,
      this.subcategorySelect,
      this.sortSelection,
      this.salesFilter,
      this.veganFilter,
      this.forKidsFilter,
    ]);
    this.initListeners();
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
    this.categorySelect.addListener('change', () => {
      this.handleCategoryChange();
    });
    this.salesFilter.addListener('change', () => {
      this.handleFiltersChange('IS_SALE');
    });
    this.veganFilter.addListener('change', () => {
      this.handleFiltersChange('IS_VEGAN');
    });
    this.forKidsFilter.addListener('change', () => {
      this.handleFiltersChange('IS_KIDS');
    });
    this.sortSelection.addListener('change', () => {
      this.handleSortChange(sortProducts(this.sortSelection.getValue()));
    });
  }

  private async reset() {
    this.addClass(styles.inactive);
    await ProductService.resetFilters().then((data) => this.productCardsBlock.setProducts(data.body.results));
    this.updateView();
    this.removeClass(styles.inactive);
    this.breadcrumbs.update(['CATALOG']);
    this.router.setEmptyUrlCatalog();
  }

  private updateView() {
    [this.salesFilter, this.veganFilter, this.forKidsFilter].forEach((filter) => filter.setValue(false));
    this.searchInput.reset();
    [this.categorySelect, this.subcategorySelect].forEach((select) => select.reset());
    this.sortSelection.reset();
    this.subcategorySelect.addClass(styles.inactive);
  }

  private handleSearch(query: string) {
    ProductService.setSearchQuery(query);
    ProductService.getFilteredProducts().then((data) => this.productCardsBlock.setProducts(data.body.results));
  }

  private async handleCategoryChange() {
    if (!this.isCategoryChosen()) {
      return;
    }

    const categoryID = CATEGORIES[transformCategoryName(this.categorySelect.getValue())];
    const keys: string[] = [];
    await ProductService.getSubcategories(categoryID)
      .then((data) => {
        const subcategories = data.body.results;
        if (subcategories.length) {
          subcategories.forEach((subcategory) => {
            keys.push(subcategory.key?.replace('-', ' ').replace('_', ' & ') as string);
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
    if (!keys.length) {
      this.subcategorySelect.reset();
      this.subcategorySelect.addClass(styles.inactive);
    } else {
      this.subcategorySelect.destroy();
      this.subcategorySelect = new FormSelection('Subcategory', transformCategoryNamesForView(keys));
      this.subcategorySelect.addListener('change', () => {
        this.handleSubcategoryChange();
      });
      this.categorySelect.getNode().insertAdjacentElement('afterend', this.subcategorySelect.getNode());
    }

    const categoryKey = Object.keys(CATEGORIES).find((key) => CATEGORIES[key] === categoryID) ?? '';
    this.breadcrumbs.update(['CATALOG', this.categorySelect.getValue()]);
    this.router.setUrlCatalog(categoryKey);

    ProductService.setChosenCategory(categoryID);
    ProductService.getFilteredProducts().then((data) => this.productCardsBlock.setProducts(data.body.results));
  }

  private handleSubcategoryChange() {
    this.breadcrumbs.update(['CATALOG', this.categorySelect.getValue(), this.subcategorySelect.getValue()]);
    this.router.setUrlCatalog(transformCategoryName(this.subcategorySelect.getValue()));
    const subcategoryID = SUBCATEGORIES[transformCategoryName(this.subcategorySelect.getValue())];
    ProductService.setChosenCategory(subcategoryID);
    ProductService.getFilteredProducts().then((data) => this.productCardsBlock.setProducts(data.body.results));
  }

  private isCategoryChosen() {
    return this.categorySelect.getValue();
  }

  private handleFiltersChange(filterValue: FilterKeys) {
    ProductService.applyFilter(filterValue);
    ProductService.getFilteredProducts().then((data) => this.productCardsBlock.setProducts(data.body.results));
    this.router.setUrlCatalog(filterValue);
  }

  private handleSortChange(value: SortKey) {
    ProductService.applySort(value);
    ProductService.getFilteredProducts().then((data) => this.productCardsBlock.setProducts(data.body.results));
    this.router.setUrlCatalog(value);
  }

  public async setValues(values: string[]) {
    if (values.includes('IS_VEGAN')) {
      this.veganFilter.setValue(true);
      const event = new Event('change', { bubbles: true });
      this.veganFilter.getNode().dispatchEvent(event);
    }
    if (values.includes('IS_KIDS')) {
      this.forKidsFilter.setValue(true);
      const event = new Event('change', { bubbles: true });
      this.forKidsFilter.getNode().dispatchEvent(event);
    }
    if (values.includes('IS_SALE')) {
      this.salesFilter.setValue(true);
      const event = new Event('change', { bubbles: true });
      this.salesFilter.getNode().dispatchEvent(event);
    }
    if (values.some((value) => value in SORT)) {
      const validValue = values.find((value) => value in SORT);
      if (validValue) {
        this.sortSelection.setValue(SORT_SELECTION[validValue as keyof typeof SORT_SELECTION]);
        const event = new Event('change', { bubbles: true });
        this.sortSelection.getNode().dispatchEvent(event);
      }
    }
    if (values.some((value) => value in CATEGORIES)) {
      const validValue = values.find((value) => value in CATEGORIES);
      if (validValue) {
        const selectValue = String(transformCategoryNamesForView([validValue]));
        this.categorySelect.setValue(selectValue);
        const event = new Event('change', { bubbles: true });
        this.categorySelect.getNode().dispatchEvent(event);
      }
    }
    if (values.some((value) => value in SUBCATEGORIES)) {
      const validValue = values.find((value) => value in SUBCATEGORIES);
      if (validValue) {
        const selectValue = String(transformCategoryNamesForView([validValue]));
        setTimeout(() => {
          this.subcategorySelect.setValue(selectValue);
          const event = new Event('change', { bubbles: true });
          this.subcategorySelect.getNode().dispatchEvent(event);
        }, 400);
      }
    }
  }
}
