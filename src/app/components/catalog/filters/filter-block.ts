import FormField from '@components/form-ui-elements/formField';
import FormSelection from '@components/form-ui-elements/formSelection';
import Toggler from '@components/form-ui-elements/formToggler';
import ProductService from '@services/product_service/product_service';
import BaseComponent from '@utils/base-component';
import { button } from '@utils/elements';

import styles from './_filters.scss';
import type ProductCards from '../product-cards/product-cards';

enum Filters {
  IS_VEGAN = 'variants.attributes.Vegan:true',
  IS_KIDS = 'variants.attributes.ForKids:true',
  IS_SALE = 'variants.scopedPriceDiscounted:true',
}

enum SORT {
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
    this.searchInput = new FormField('', 'search', false);

    this.searchForm = new BaseComponent<HTMLFormElement>(
      { tag: 'form', action: '#' },
      (this.searchInput = new FormField('', 'search', false))
    );
    this.salesFilter = new Toggler('On sale');
    this.veganFilter = new Toggler('Vegan');
    this.forKidsFilter = new Toggler('For kids');
    this.sortSelection = new FormSelection(SORT.TITLE, [SORT.PRICE_DESC, SORT.PRICE_ASC, SORT.A_Z, SORT.Z_A]);
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

  private updateView() {
    [this.salesFilter, this.veganFilter, this.forKidsFilter].forEach((filter) => filter.setValue(false));
    this.searchInput.setValue('');
    // this.sortSelection.resetCheckedOption();
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
      this.handleFiltersChange(Filters.IS_SALE);
    });
    this.veganFilter.addListener('change', () => {
      this.handleFiltersChange(Filters.IS_VEGAN);
    });
    this.forKidsFilter.addListener('change', () => {
      this.handleFiltersChange(Filters.IS_KIDS);
    });
    this.sortSelection.addListener('change', () => {
      this.handleSortChange(this.sortProducts(this.sortSelection.getValue()));
    });
  }

  private handleSearch(query: string) {
    ProductService.setSearchQuery(query);
    ProductService.getFilteredProducts().then((data) => this.productCardsBlock.setProducts(data.body.results));
  }

  private handleFiltersChange(filterValue: Filters) {
    ProductService.applyFilter(filterValue);
    ProductService.getFilteredProducts().then((data) => this.productCardsBlock.setProducts(data.body.results));
  }

  private handleSortChange(value: string) {
    ProductService.applySort(value);
    ProductService.getFilteredProducts().then((data) => this.productCardsBlock.setProducts(data.body.results));
  }

  private handleReset() {
    ProductService.resetFilters().then((data) => this.productCardsBlock.setProducts(data.body.results));
    this.updateView();
  }

  private sortProducts(value: string): string {
    switch (value) {
      case SORT.PRICE_DESC:
        return 'price desc';
      case SORT.PRICE_ASC:
        return 'price asc';
      case SORT.A_Z:
        return 'name.en asc';
      case SORT.Z_A:
        return 'name.en desc';
      default:
        return '';
    }
  }
}
