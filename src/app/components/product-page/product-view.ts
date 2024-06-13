import type { Image, Price, ProductProjection } from '@commercetools/platform-sdk';
import 'swiper/css/bundle';

import { setPrice } from '@components/catalog/card-element/card-model';
import AddToCart from '@components/form-ui-elements/addToCartToggler';
import Count from '@components/form-ui-elements/countInput';
import type HeaderController from '@components/header/header_controller';
import Modal from '@components/modal/modal';
import CurrentCart from '@services/cart-service/currentCart';
import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { button, div, h2, p, span } from '@utils/elements';
import setLoader from '@utils/loader/loader-view';

import product_styles from './_product-styles.scss';
import swiper_styles from './swiper/_swiper-custom.scss';
import { initSwiper, initZoomedSwiper } from './swiper/swiper';
import general_styles from '../../_app_style.scss';
import card_styles from '../catalog/card-element/_card-style.scss';

export default class ProductView extends BaseComponent {
  protected router: Router;

  public addBtn: AddToCart = new AddToCart();

  public count: Count = new Count();

  public addBtnLabel: BaseComponent<HTMLSpanElement> | null = null;

  public removeFromCartButton: BaseComponent<HTMLButtonElement> | null = null;

  constructor(
    router: Router,
    private headerController: HeaderController
  ) {
    super({ tag: 'section', className: product_styles.wrapper });
    this.router = router;
  }

  public setContent(data: ProductProjection) {
    const swiper = this.setSwiper(data.masterVariant.images);
    const text = this.setText(data);
    this.appendChildren([swiper, text]);
    initSwiper();
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
    const thumbs = div(['swiper2', product_styles.thumbs_img_wrapper]);
    const swiperWrapper = div(['swiper-wrapper', swiper_styles.swiper_wrapper]);
    const swiperThumbs = div(['swiper-wrapper', swiper_styles.swiper_wrapper_thumbs]);
    data.forEach((image) => {
      const loader = setLoader();
      const slide = div(['swiper-slide', product_styles.main_img_wrapper], loader);
      const thumbsSlide = div(['swiper-slide', product_styles.main_img_wrapper], loader);
      const img = new BaseComponent<HTMLImageElement>({ tag: 'img', src: image.url, className: product_styles.img });
      const imgSmall = new BaseComponent<HTMLImageElement>({
        tag: 'img',
        src: image.url,
        className: product_styles.img,
      });
      img.addListener('load', () => {
        const imgLoader = slide.getChildren[0];
        const imgLoaderThumbs = thumbsSlide.getChildren[0];
        if (imgLoader) {
          imgLoader.destroy();
          imgLoaderThumbs.destroy();
        }
        slide.append(img);
        thumbsSlide.append(imgSmall);
      });
      swiperThumbs.append(thumbsSlide);
      swiperWrapper.append(slide);
    });

    const controlPrev = div(['swiper-button-prev', swiper_styles.button]);
    const controlNext = div(['swiper-button-next', swiper_styles.button]);
    const scrollbar = div(['swiper-scrollbar']);

    swiperWrapper.addListener('click', () => {
      const modal = new Modal({
        title: '',
        content: this.setModalContent(data),
        parent: this.getNode(),
        fullScreen: true,
      });
      modal.addClass(swiper_styles.overlay);
      modal.modal.addClass(swiper_styles.modal);
      modal.open();
      initZoomedSwiper();
    });
    swiper.appendChildren([swiperWrapper, controlPrev, controlNext, scrollbar]);
    thumbs.appendChildren([swiperThumbs]);
    return div([product_styles.slider], thumbs, swiper);
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

    const bottomBlock = this.createBottomBlock(data);

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

  private createBottomBlock(data: ProductProjection) {
    const backBtn = button([product_styles.back_btn, general_styles.btn], 'BACK TO CATALOG', {
      onclick: () => {
        this.router.navigateToCatalogFromProduct();
      },
    });
    this.addBtnLabel = span([product_styles.add_button_label], 'ADD TO CART');
    this.addBtn.append(this.addBtnLabel);
    if (CurrentCart.getProductCountByID(data.id)) {
      this.addBtnLabel.setTextContent('ALREADY IN CART');
      this.addBtn.addClass(product_styles.add_button_active);
      this.addBtn.select();
      this.count.setValue(CurrentCart.getProductCountByID(data.id));
    }
    this.addBtn.addClass(product_styles.add_button);
    this.removeFromCartButton = button([product_styles.remove_button, general_styles.btn], 'REMOVE FROM CART');
    const block = div(
      [product_styles.bottom_block],
      div([product_styles.buttons_block], this.count, this.addBtn),
      this.removeFromCartButton
    );
    // this.setInputHandlers(block);
    this.setButtonsActive(this.addBtn.getValue());
    return div([product_styles.buttons_block_wrapper], block, backBtn);
  }

  public setButtonsActive(isActive: boolean) {
    if (isActive) {
      this.addBtnLabel?.setTextContent('ALREADY IN CART');
      this.addBtn.addClass(product_styles.add_button_active);
      this.removeFromCartButton?.addClass(product_styles.remove_button_active);
    } else {
      this.addBtnLabel?.setTextContent('ADD TO CART');
      this.addBtn.removeClass(product_styles.add_button_active);
      this.removeFromCartButton?.addClass(product_styles.fadeout);
      setTimeout(() => {
        this.removeFromCartButton?.removeClass(product_styles.fadeout);
        this.removeFromCartButton?.removeClass(product_styles.remove_button_active);
      }, 300);
    }
  }
}
