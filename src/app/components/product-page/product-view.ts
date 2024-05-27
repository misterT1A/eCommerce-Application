import type { Image, Price, ProductProjection } from '@commercetools/platform-sdk';

import { changeCount, setPrice } from '@components/catalog/card-element/card-model';
import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { button, div, h2, p } from '@utils/elements';
import setLoader from '@utils/loader/loader-view';

import product_styles from './_product-styles.scss';
import general_styles from '../../_app_style.scss';
import card_styles from '../catalog/card-element/_card-style.scss';

export default class ProductView extends BaseComponent {
  protected router: Router;

  constructor(router: Router) {
    super({ tag: 'section', className: product_styles.wrapper });
    this.router = router;
  }

  public setContent(data: ProductProjection) {
    console.log(data);
    const miniImgs = this.setMiniImgBlock(data.masterVariant.images);
    const mainImg = this.setMainImg(data.masterVariant.images);
    const text = this.setText(data);

    this.appendChildren([miniImgs, mainImg, text]);
    this.addListener('click', (e: Event) => this.handler(e));
  }

  private setMiniImgBlock(data: Image[] | undefined): BaseComponent {
    if (!data) {
      return p([product_styles.mini_empty_img_template], 'no image');
    }

    const wrapper = div([product_styles.mini_img_block]);

    data.forEach((imgUrl) => {
      const loader = setLoader();
      const imgWrapper = div([product_styles.mini_img_wrapper], loader);

      const img = new BaseComponent<HTMLImageElement>({ tag: 'img', src: imgUrl.url });

      img.addListener('load', () => {
        if (img.getNode().width > img.getNode().height) {
          img.addClass(product_styles.mini_img_Height);
        } else {
          img.addClass(product_styles.mini_img_Width);
        }

        imgWrapper.getChildren[0].destroy();
        imgWrapper.append(img);
      });

      wrapper.append(imgWrapper);
    });

    return wrapper;
  }

  private setMainImg(data: Image[] | undefined): BaseComponent {
    if (!data) {
      return p([product_styles.main_empty_img_template], 'no image');
    }

    const loader = setLoader();
    const imgWrapper = div([product_styles.main_img_wrapper], loader);

    const img = new BaseComponent<HTMLImageElement>({ tag: 'img', src: data[0].url });

    img.addListener('load', () => {
      if (img.getNode().width > img.getNode().height) {
        img.addClass(product_styles.main_img_Height);
      } else {
        img.addClass(product_styles.main_img_Width);
      }

      imgWrapper.getChildren[0].destroy();
      imgWrapper.append(img);
    });

    return imgWrapper;
  }

  private setText(data: ProductProjection): BaseComponent {
    if (!data) {
      return p([product_styles.main_empty_img_template], 'No description');
    }

    const wrapper = div([product_styles.text_wrapper]);

    const title = h2([product_styles.title], data.name.en);

    const price = this.createPriceBlock(data.masterVariant.prices as Price[]);

    const description = p([product_styles.description], 'No description');

    if (data.description) {
      description.setTextContent(data.description.en);
    }

    const bottomBlock = this.createBottomBlock();

    wrapper.appendChildren([title, price, description, bottomBlock]);
    return wrapper;
  }

  private createPriceBlock(priceObj: Price[]): BaseComponent {
    const price = new BaseComponent({ textContent: setPrice(priceObj[0].value.centAmount) });

    if (priceObj[0].discounted) {
      price.addClass(card_styles.price_throgh);
      price.append(p([card_styles.price_discount], setPrice(priceObj[0].discounted.value.centAmount)));
    } else {
      price.addClass(card_styles.price);
    }

    return div([card_styles.pay_block], price);
  }

  private createBottomBlock() {
    const countMinus = p([card_styles.count_minus], '-');
    const countPlus = p([card_styles.count_plus], '+');
    const countNum = p([card_styles.count_Num], '1');
    const countWrapper = div([card_styles.count_wrapper], countMinus, countNum, countPlus);

    // const cartBtn = button([styles.cart_btn], 'ADD TO CART');
    const backBtn = button([product_styles.back_btn, general_styles.btn], 'BACK TO CATALOG', {
      onclick: () => this.router.navigate(Pages.CATALOG),
    });
    return div([product_styles.bottom_block], countWrapper, backBtn);
  }

  private handler(e: Event) {
    const target = (e.target as HTMLElement)?.textContent;
    switch (target) {
      case '+':
        changeCount((e.target as HTMLElement).parentElement, true);
        break;
      case '-':
        changeCount((e.target as HTMLElement).parentElement, false);
        break;
      default:
        break;
    }
  }
}
