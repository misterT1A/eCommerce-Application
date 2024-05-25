import FormSelection from '@components/form-ui-elements/formSelection';
import Toggler from '@components/form-ui-elements/formToggler';
import ProductService from '@services/product_service/product_service';
import BaseComponent from '@utils/base-component';

import styles from './_filters.scss';
import type ProductCards from '../product-cards/product-cards';

enum Attributes {
  VEGAN = 'variants.attributes.Vegan:true',
  KIDS = 'variants.attributes.ForKids:true',
  SALE = 'variants.scopedPriceDiscounted:true',
}

enum SORT {
  TITLE = 'Sort By',
  PRICE_DESC = 'Descending price',
  PRICE_ASC = 'Ascending price',
  A_Z = 'A-Z',
  Z_A = 'Z-A',
}

export default class FilterBlock extends BaseComponent {
  public salesFilter: Toggler;

  private veganFilter: Toggler;

  private forKidsFilter: Toggler;

  private sortSelection: FormSelection;

  private attributes: IProductAttributes = {};

  constructor(private productCardsBlock: ProductCards) {
    super({ tag: 'div', className: styles.filterBlock });
    this.salesFilter = new Toggler('On sale');
    this.veganFilter = new Toggler('Vegan');
    this.forKidsFilter = new Toggler('For kids');
    this.sortSelection = new FormSelection(SORT.TITLE, [SORT.PRICE_DESC, SORT.PRICE_ASC, SORT.A_Z, SORT.Z_A]);
    this.appendChildren([this.sortSelection, this.salesFilter, this.veganFilter, this.forKidsFilter]);
    this.initListeners();
  }

  private initListeners() {
    this.salesFilter.addListener('change', () => {
      this.handleFiltersChange('sale', this.salesFilter, Attributes.SALE);
    });

    this.veganFilter.addListener('change', () => {
      this.handleFiltersChange('vegan', this.veganFilter, Attributes.VEGAN);
    });
    this.forKidsFilter.addListener('change', () => {
      this.handleFiltersChange('kids', this.forKidsFilter, Attributes.KIDS);
    });
    this.sortSelection.addListener('change', () => {
      this.handleSortChange(this.sortProducts(this.sortSelection.getValue()));
    });
  }

  private handleFiltersChange(attributeKey: keyof IProductAttributes, toggler: Toggler, attributeValue: Attributes) {
    this.attributes[attributeKey] = toggler.getValue() ? attributeValue : '';
    ProductService.getFilteredProducts(Object.values(this.attributes)).then((data) =>
      this.productCardsBlock.setProducts(data.body.results)
    );
  }

  private handleSortChange(value: string[]) {
    ProductService.getFilteredProducts(Object.values(this.attributes), value).then((data) =>
      this.productCardsBlock.setProducts(data.body.results)
    );
  }

  private sortProducts(value: string) {
    switch (value) {
      case SORT.PRICE_DESC:
        return ['price desc'];
      case SORT.PRICE_ASC:
        return ['price asc'];
      case SORT.A_Z:
        return ['name.en asc'];
      case SORT.Z_A:
        return ['name.en desc'];
      default:
        return [];
    }
  }
}
