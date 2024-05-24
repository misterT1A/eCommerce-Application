import Toggler from '@components/form-ui-elements/formToggler';
import ProductService from '@services/product_service/product_service';
import BaseComponent from '@utils/base-component';

import styles from './_filters.scss';
import type ProductCards from '../product-cards/product-cards';

enum Attributes {
  VEGAN = 'Vegan',
  KIDS = 'ForKids',
}

export default class FilterBlock extends BaseComponent {
  private salesFilter: Toggler;

  private veganFilter: Toggler;

  private forKidsFilter: Toggler;

  constructor(private productCardsBlock: ProductCards) {
    super({ tag: 'div', className: styles.filterBlock });
    this.salesFilter = new Toggler('On sale');
    this.veganFilter = new Toggler('Vegan');
    this.forKidsFilter = new Toggler('For kids');
    this.appendChildren([this.salesFilter, this.veganFilter, this.forKidsFilter]);
    this.initListeners();
  }

  public initListeners() {
    this.salesFilter.addListener('change', () => {
      if (this.salesFilter.getValue()) {
        ProductService.getDiscountedProducts().then((data) => this.productCardsBlock.setProducts(data.body.results));
      }
    });
    this.veganFilter.addListener('change', () => {
      if (this.veganFilter.getValue()) {
        ProductService.getProductsByAttribute(Attributes.VEGAN).then((data) =>
          this.productCardsBlock.setProducts(data.body.results)
        );
      }
    });
    this.forKidsFilter.addListener('change', () => {
      ProductService.getProductsByAttribute(Attributes.KIDS).then((data) =>
        this.productCardsBlock.setProducts(data.body.results)
      );
    });
  }
}
