import type { ProductProjection, ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';

import ProductService from '@services/product_service/product_service';
import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { button, div, h2 } from '@utils/elements';
import setLazyLoader from '@utils/lazy loader/lazy-loader';

import styles from './_product-style.scss';
import Card from '../card-element/card-element-view';
// import isNeedAddButton from '../catalog-model';
import type CatalogView from '../catalog-view';

export default class ProductCards extends BaseComponent {
  protected loader: BaseComponent | null;

  protected addButton: BaseComponent | null;

  constructor(
    protected router: Router,
    protected MainView: CatalogView
  ) {
    super({ className: styles.product_wrapper });

    this.loader = null;
    this.addButton = null;
  }

  public setProducts(body: ProductProjectionPagedSearchResponse, isAddNewCards = false) {
    const products: ProductProjection[] = body.results;

    if (!products) {
      return;
    }

    if (isAddNewCards) {
      this.createCards(products);

      if (this.isNeedAddButton(body) && !this.addButton) {
        this.setAddButton();
      }
    } else {
      this.hideBlock().then(() => {
        this.removeClass(styles.hide);
        this.destroyChildren();

        if (!products.length) {
          this.showNotFoundTitle();
          return;
        }

        this.createCards(products);

        if (this.isNeedAddButton(body)) {
          this.setAddButton();
        }
      });
    }
  }

  private createCards(products: ProductProjection[]) {
    products.forEach((product, index) => {
      const price = product.masterVariant.prices?.[0];

      const props: ICardProps = {
        key: product.key as string,
        img: product.masterVariant.images as IImgCard[],
        title: product.name.en,
        description: product.description?.en as string,
        price,
      };

      const card = new Card(props, this.router);
      card.setAnimDelay(index);
      this.append(card);
    });
  }

  public showNotFoundTitle() {
    const title = h2([styles.title_noFound], 'No products were found according to applied filters');
    this.append(title);
  }

  private async hideBlock() {
    this.addClass(styles.hide);
    await new Promise((res) => {
      setTimeout(() => res(true), 200);
    });
  }

  private setAddButton() {
    this.addButton = button([styles.add_btn], 'Show more', {
      onclick: () => this.addCardsToContent(),
    });
    const animDelay = 500;
    setTimeout(() => this.append(this.addButton), animDelay);
  }

  private destroyAddButton() {
    if (this.addButton) {
      this.addButton.destroy();
      this.addButton = null;
    }
  }

  private hideAddButton() {
    this.addButton?.addClass(styles.hide);
  }

  private showAddButton() {
    this.addButton?.removeClass(styles.hide);
  }

  private addLoader() {
    if (!this.loader) {
      this.loader = div([styles.loader_wrapper], setLazyLoader());
      this.append(this.loader);
    }
  }

  private destroyLoader() {
    if (this.loader) {
      this.loader.destroy();
      this.loader = null;
    }
  }

  private showLoader() {
    this.hideAddButton();
    this.addLoader();
  }

  private hideLoader() {
    this.destroyLoader();
    this.showAddButton();
  }

  private addCardsToContent() {
    this.showLoader();
    const countCards = ProductService.setOffsetCardsCount();

    ProductService.getFilteredProducts(true)
      .then((data) => {
        if (countCards > ProductService.getDefaultCardsCount()) {
          this.router.setUrlCatalog(`CARDS_${countCards}`, data.body.total);
        }
        this.hideLoader();
        this.setProducts(data.body, true);
        this.MainView.getFilterBlock.updatePriceRange(data);
        if (!this.isNeedAddButton(data.body)) {
          this.destroyAddButton();
        }
      })
      .catch(() => this.router.navigate(Pages.ERROR, true));
  }

  private isNeedAddButton(body: ProductProjectionPagedSearchResponse) {
    if (!body || !body.total) {
      return false;
    }
    const cardsOnPage = body.count + body.offset;

    return cardsOnPage < body.total;
  }
}
