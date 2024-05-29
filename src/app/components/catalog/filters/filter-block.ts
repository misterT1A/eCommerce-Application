import FormField from '@components/form-ui-elements/formField';
import FormSelection from '@components/form-ui-elements/formSelection';
import Toggler from '@components/form-ui-elements/formToggler';
import ProductService from '@services/product_service/product_service';
import BaseComponent from '@utils/base-component';
import { button } from '@utils/elements';

import styles from './_filters.scss';
import { CATEGORIES, FILTERS, SORT, SUBCATEGORIES } from './constants-filters';
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
    private breadcrumbs: Breadcrumbs
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
    this.categorySelect = new FormSelection('Category', [...Object.keys(CATEGORIES)]);
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
      this.handleFiltersChange(FILTERS.IS_SALE);
    });
    this.veganFilter.addListener('change', () => {
      this.handleFiltersChange(FILTERS.IS_VEGAN);
    });
    this.forKidsFilter.addListener('change', () => {
      this.handleFiltersChange(FILTERS.IS_KIDS);
    });
    this.sortSelection.addListener('change', () => {
      this.handleSortChange(this.sortProducts(this.sortSelection.getValue()));
    });
  }

  private async reset() {
    this.addClass(styles.inactive);
    await ProductService.resetFilters().then((data) => this.productCardsBlock.setProducts(data.body.results));
    this.updateView();
    this.removeClass(styles.inactive);
    this.breadcrumbs.update(['CATALOG']);
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

    const categoryID = CATEGORIES[this.categorySelect.getValue()];
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
      this.subcategorySelect = new FormSelection('Subcategory', [...keys]);
      this.subcategorySelect.addListener('change', () => {
        this.handleSubcategoryChange();
      });
      this.categorySelect.getNode().insertAdjacentElement('afterend', this.subcategorySelect.getNode());
    }
    // console.log(categoryID);

    this.breadcrumbs.update(['CATALOG', this.categorySelect.getValue()]);
    ProductService.setChosenCategory(CATEGORIES[this.categorySelect.getValue()]);
    ProductService.getFilteredProducts().then((data) => this.productCardsBlock.setProducts(data.body.results));
  }

  private handleSubcategoryChange() {
    this.breadcrumbs.update(['CATALOG', this.categorySelect.getValue(), this.subcategorySelect.getValue()]);
    ProductService.setChosenCategory(SUBCATEGORIES[this.subcategorySelect.getValue()]);
    ProductService.getFilteredProducts().then((data) => this.productCardsBlock.setProducts(data.body.results));
  }

  private isCategoryChosen() {
    return this.categorySelect.getValue();
  }

  private handleFiltersChange(filterValue: string) {
    ProductService.applyFilter(filterValue);
    ProductService.getFilteredProducts().then((data) => this.productCardsBlock.setProducts(data.body.results));
  }

  private handleSortChange(value: string) {
    ProductService.applySort(value);
    ProductService.getFilteredProducts().then((data) => this.productCardsBlock.setProducts(data.body.results));
  }

  private sortProducts(value: string): string {
    switch (value) {
      case SORT_SELECTION.PRICE_DESC:
        return SORT.PRICE_DESC;
      case SORT_SELECTION.PRICE_ASC:
        return SORT.PRICE_ASC;
      case SORT_SELECTION.A_Z:
        return SORT.A_Z;
      case SORT_SELECTION.Z_A:
        return SORT.Z_A;
      default:
        return '';
    }
  }

  public setValues(values: string[]) {
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
  }
}
