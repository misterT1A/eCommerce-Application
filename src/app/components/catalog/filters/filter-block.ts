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

interface IAttributes {
  sale?: string;
  vegan?: string;
  kids?: string;
}

export default class FilterBlock extends BaseComponent {
  private salesFilter: Toggler;

  private veganFilter: Toggler;

  private forKidsFilter: Toggler;

  private attributes: IAttributes = {};

  constructor(private productCardsBlock: ProductCards) {
    super({ tag: 'div', className: styles.filterBlock });
    this.salesFilter = new Toggler('On sale');
    this.veganFilter = new Toggler('Vegan');
    this.forKidsFilter = new Toggler('For kids');
    this.appendChildren([this.salesFilter, this.veganFilter, this.forKidsFilter]);
    this.initListeners();
  }

  private initListeners() {
    this.salesFilter.addListener('change', () => {
      this.handleFilterChange('sale', this.salesFilter, Attributes.SALE);
    });

    this.veganFilter.addListener('change', () => {
      this.handleFilterChange('vegan', this.veganFilter, Attributes.VEGAN);
    });
    this.forKidsFilter.addListener('change', () => {
      this.handleFilterChange('kids', this.forKidsFilter, Attributes.KIDS);
    });
  }

  private handleFilterChange(attributeKey: keyof IAttributes, filter: Toggler, attributeValue: Attributes) {
    this.attributes[attributeKey] = filter.getValue() ? attributeValue : '';
    ProductService.getFilteredProducts(Object.values(this.attributes)).then((data) =>
      this.productCardsBlock.setProducts(data.body.results)
    );
  }
}
