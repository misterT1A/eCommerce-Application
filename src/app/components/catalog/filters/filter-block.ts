import FormField from '@components/form-ui-elements/formField';
import FormSelection from '@components/form-ui-elements/formSelection';
import Toggler from '@components/form-ui-elements/formToggler';
import ProductService from '@services/product_service/product_service';
import BaseComponent from '@utils/base-component';
import { button } from '@utils/elements';

import styles from './_filters.scss';
import { FILTERS, SORT } from './constants-filters';
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

  private salesFilter: Toggler;

  private veganFilter: Toggler;

  private forKidsFilter: Toggler;

  private sortSelection: FormSelection;

  constructor(private productCardsBlock: ProductCards) {
    super({ tag: 'div', className: styles.filterBlock });
    this.resetButton = button([styles['reset-btn']], 'RESET FILTERS', {
      onclick: () => {
        this.handleReset();
      },
    });
    this.searchForm = new BaseComponent<HTMLFormElement>(
      { tag: 'form', action: '#' },
      (this.searchInput = new FormField('', 'search', false))
    );
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

  private async handleReset() {
    this.addClass(styles.inactive);
    await ProductService.resetFilters().then((data) => this.productCardsBlock.setProducts(data.body.results));
    this.updateView();
    this.removeClass(styles.inactive);
  }

  private updateView() {
    [this.salesFilter, this.veganFilter, this.forKidsFilter].forEach((filter) => filter.setValue(false));
    this.searchInput.reset();
    this.sortSelection.reset();
  }

  private handleSearch(query: string) {
    ProductService.setSearchQuery(query);
    ProductService.getFilteredProducts().then((data) => this.productCardsBlock.setProducts(data.body.results));
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
  }
}
