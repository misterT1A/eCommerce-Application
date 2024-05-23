import Toggler from '@components/form-ui-elements/formToggler';
import AuthService from '@services/auth-service';
import BaseComponent from '@utils/base-component';

import styles from './_filters.scss';

export default class FilterBlock extends BaseComponent {
  private salesFilter: Toggler;

  private veganFilter: Toggler;

  private forKidsFilter: Toggler;

  constructor() {
    super({ tag: 'section', className: styles.filterBlock });
    this.salesFilter = new Toggler('On sale');
    this.veganFilter = new Toggler('Vegan');
    this.forKidsFilter = new Toggler('For kids');
    this.appendChildren([this.salesFilter, this.veganFilter, this.forKidsFilter]);
    this.initListeners();
  }

  public initListeners() {
    this.salesFilter.addListener('change', () => {
      console.clear();
      if (this.salesFilter.getValue()) {
        this.getDiscountedProducts();
      }
    });
    this.veganFilter.addListener('change', () => {
      console.clear();
      if (this.veganFilter.getValue()) {
        this.getProductsByAttribute('Vegan');
      }
    });
    this.forKidsFilter.addListener('change', () => {
      console.clear();
      if (this.forKidsFilter.getValue()) {
        this.getProductsByAttribute('ForKids');
      }
    });
  }

  public getDiscountedProducts() {
    AuthService.getRoot()
      .productProjections()
      .search()
      .get({
        queryArgs: {
          priceCurrency: 'EUR',
          filter: 'variants.scopedPriceDiscounted:true',
        },
      })
      .execute()
      .then((response) => {
        console.log(response.body.results);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  public getProductsByAttribute(attr: string) {
    AuthService.getRoot()
      .productProjections()
      .search()
      .get({
        queryArgs: {
          filter: `variants.attributes.${attr}:true`,
        },
      })
      .execute()
      .then((response) => {
        console.log(response.body.results);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
