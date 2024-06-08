// import type { ProductProjection } from '@commercetools/platform-sdk';

import Controller from '@components/controller';
import ProductsService from '@services/product_service/product_service';
import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';
// import throttle from '@utils/throttle';

import isNeedAddButton from './catalog-model';
import CatalogView from './catalog-view';

export default class CatalogController extends Controller<CatalogView> {
  constructor(
    protected router: Router,
    protected filtersParams: string[]
  ) {
    super(new CatalogView(router));

    this.initContent();
    // this.setScrollTracker();
  }

  private initContent() {
    ProductsService.resetFilters();
    if (!this.filtersParams) {
      ProductsService.getFilteredProducts()
        .then((data) => {
          console.log('main', data);
          this.view.getProductCardView.setProducts(data.body.results);
          this.view.getFilterBlock.updatePriceRange(data);
          if (isNeedAddButton(data.body)) {
            this.view.setAddButton(this.addCardsToContent.bind(this));
          }
        })
        .catch(() => this.router.navigate(Pages.ERROR, true));
    } else {
      this.view.getFilterBlock.setValues(this.filtersParams);
    }
  }

  private addCardsToContent() {
    this.view.showLoader();
    ProductsService.getFilteredProducts(true)
      .then((data) => {
        this.view.hideLoader();
        console.log('add', data);
        this.view.getProductCardView.setProducts(data.body.results, true);
        this.view.getFilterBlock.updatePriceRange(data);
        if (!isNeedAddButton(data.body)) {
          this.view.destroyAddButton();
        }
      })
      .catch(() => this.router.navigate(Pages.ERROR, true));
  }

  // private scrollTracker() {
  //   const viewportHeight = window.innerHeight;
  //   const pageHeight = document.body.offsetHeight;
  //   const currentPosition = window.scrollY;

  //   const availableHeight = pageHeight - viewportHeight;

  //   if (currentPosition === availableHeight) {
  //     console.log(currentPosition, availableHeight);
  //     this.addCardsToContent();
  //   }
  // }

  // private setScrollTracker() {
  //   const optimizedTracker = throttle(() => this.scrollTracker(), 100);

  //   window.addEventListener('scroll', () => optimizedTracker());
  //   window.addEventListener('resize', () => optimizedTracker());
  // }
}
