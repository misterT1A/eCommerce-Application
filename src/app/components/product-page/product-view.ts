import type { Image, ProductProjection } from '@commercetools/platform-sdk';

import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { div, h2, p } from '@utils/elements';
import setLoader from '@utils/loader/loader-view';

import styles from './_product-styles.scss';

export default class ProductView extends BaseComponent {
  protected router: Router;

  constructor(router: Router) {
    super({ tag: 'section', className: styles.wrapper });
    this.router = router;
  }

  public setContent(data: ProductProjection) {
    console.log(data);
    const miniImgs = this.setMiniImgBlock(data.masterVariant.images);
    const mainImg = this.setMainImg(data.masterVariant.images);
    const text = this.setText(data);

    this.appendChildren([miniImgs, mainImg, text]);
  }

  private setMiniImgBlock(data: Image[] | undefined): BaseComponent {
    if (!data) {
      return p([styles.mini_emty_img_template], 'no image');
    }

    const wrapper = div([styles.mini_img_block]);

    data.forEach((imgUrl) => {
      const loader = setLoader();
      const imgWrapper = div([styles.mini_img_wrapper], loader);

      const img = new BaseComponent<HTMLImageElement>({ tag: 'img', src: imgUrl.url });

      img.addListener('load', () => {
        if (img.getNode().width > img.getNode().height) {
          img.addClass(styles.mini_img_Height);
        } else {
          img.addClass(styles.mini_img_Width);
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
      return p([styles.main_emty_img_template], 'no image');
    }

    const loader = setLoader();
    const imgWrapper = div([styles.main_img_wrapper], loader);

    const img = new BaseComponent<HTMLImageElement>({ tag: 'img', src: data[0].url });

    img.addListener('load', () => {
      if (img.getNode().width > img.getNode().height) {
        img.addClass(styles.main_img_Height);
      } else {
        img.addClass(styles.main_img_Width);
      }

      imgWrapper.getChildren[0].destroy();
      imgWrapper.append(img);
    });

    return imgWrapper;
  }

  private setText(data: ProductProjection): BaseComponent {
    if (!data) {
      return p([styles.main_emty_img_template], 'no description');
    }

    const wrapper = div([styles.text_wrapper]);

    const title = h2([styles.title], data.name.en);

    const description = p([styles.description], 'No desription');

    if (data.description) {
      description.setTextContent(data.description.en);
    }

    wrapper.appendChildren([title, description]);
    return wrapper;
  }
}
