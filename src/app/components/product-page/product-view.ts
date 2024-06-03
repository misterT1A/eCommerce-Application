import type { Image, Price, ProductProjection } from '@commercetools/platform-sdk';
import 'swiper/css/bundle';

import { changeCount, setPrice } from '@components/catalog/card-element/card-model';
import Modal from '@components/modal/modal';
import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { button, div, h2, p } from '@utils/elements';
import setLoader from '@utils/loader/loader-view';

import product_styles from './_product-styles.scss';
import swiper_styles from './swiper/_swiper-custom.scss';
import { initSwiper, initZoomedSwiper } from './swiper/swiper';
import general_styles from '../../_app_style.scss';
import card_styles from '../catalog/card-element/_card-style.scss';

export default class ProductView extends BaseComponent {
  protected router: Router;

  constructor(router: Router) {
    super({ tag: 'section', className: product_styles.wrapper });
    this.router = router;
  }

  public setContent(data: ProductProjection) {
    const swiper = this.setSwiper(data.masterVariant.images);
    const text = this.setText(data);
    this.appendChildren([swiper, text]);
    initSwiper();
    this.addListener('click', (e: Event) => this.handler(e));
  }

  private setModalContent(data: Image[] | undefined): BaseComponent {
    if (!data) {
      return p([product_styles.main_empty_img_template], 'no image');
    }
    const swiper = div(['zoomedSwiper']);
    const swiperWrapper = div(['swiper-wrapper']);
    data.forEach((image) => {
      const loader = setLoader();
      const slide = div(['swiper-slide', swiper_styles.slide], loader);
      const img = new BaseComponent<HTMLImageElement>({
        tag: 'img',
        src: image.url,
        className: swiper_styles['img-zoom'],
      });

      img.addListener('load', () => {
        const imgLoader = slide.getChildren[0];
        if (imgLoader) {
          imgLoader.destroy();
        }
        slide.getNode().style.backgroundColor = '#faf4f4';
        slide.append(img);
      });
      swiperWrapper.append(slide);
    });

    const controlPrev = div(['swiper-button-prev', swiper_styles.button]);
    const controlNext = div(['swiper-button-next', swiper_styles.button]);
    const scrollbar = div(['swiper-scrollbar']);
    swiper.appendChildren([swiperWrapper, controlPrev, controlNext, scrollbar]);

    return swiper;
  }

  private setSwiper(data: Image[] | undefined): BaseComponent {
    if (!data) {
      return p([product_styles.main_empty_img_template], 'no image');
    }

    const swiper = div(['swiper', product_styles.main_img_wrapper]);
    const swiperWrapper = div(['swiper-wrapper']);
    data.forEach((image) => {
      const loader = setLoader();
      const slide = div(['swiper-slide', product_styles.main_img_wrapper], loader);
      const img = new BaseComponent<HTMLImageElement>({ tag: 'img', src: image.url, className: product_styles.img });

      img.addListener('load', () => {
        const imgLoader = slide.getChildren[0];
        if (imgLoader) {
          imgLoader.destroy();
        }
        slide.append(img);
      });

      swiperWrapper.append(slide);
    });

    const controlPrev = div(['swiper-button-prev', swiper_styles.button]);
    const controlNext = div(['swiper-button-next', swiper_styles.button]);
    const scrollbar = div(['swiper-scrollbar']);

    swiperWrapper.addListener('click', () => {
      const modal = new Modal({ title: '', content: this.setModalContent(data), parent: this.getNode() });
      modal.addClass(swiper_styles.overlay);
      modal.modal.addClass(swiper_styles.modal);
      modal.open();
      initZoomedSwiper();
    });
    swiper.appendChildren([swiperWrapper, controlPrev, controlNext, scrollbar]);

    return swiper;
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
      onclick: () => {
        this.router.navigateToCatalogFromProduct();
      },
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
