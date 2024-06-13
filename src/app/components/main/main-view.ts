import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import copyTextInClipboard from '@utils/copy-text-to-clipboard';
import { div, h2, span } from '@utils/elements';

import styles from './_styles.scss';
import imgKids from '../../../assets/bear-icon.svg';
import imgSale from '../../../assets/sale-icon.svg';
import imgVegan from '../../../assets/vegan-icon.svg';

export default class MainView extends BaseComponent {
  protected router: Router;

  constructor(router: Router) {
    super({ tag: 'section', className: styles.main });
    this.router = router;

    this.setContent();
  }

  private setContent() {
    const textContainer = div(
      [styles.main__sectionText],
      h2([styles.main__sectionTitle], 'Enjoy breakfast with brioches!'),
      span([styles.main_text], 'To the catalog')
    );
    const wrapper = div([styles.main__section], textContainer);
    textContainer.addListener('click', () => this.router.navigate(Pages.CATALOG));
    this.append(wrapper);

    this.appendChildren([this.setLinksBlock(), this.setPromo()]);
  }

  private setPromo() {
    const promo1Title = span([styles.second_img_title], "Get 25% off you cart order with promo code 'CRISPY25'!");
    promo1Title.addListener('click', () => copyTextInClipboard('CRISPY25', 'Promo code copied to clipboard!'));
    const promo2Title = span(
      [styles.second_img_title],
      "Buy one, get one free: Classic croissant deal with code 'DOUBLE'"
    );
    promo2Title.addListener('click', () => copyTextInClipboard('DOUBLE', 'Promo code copied to clipboard!'));
    const promo1Wrapper = div([styles.second_img_title_wrapper], promo1Title);
    const promo2Wrapper = div([styles.second_img_title_wrapper], promo2Title);

    const wrapper = div([styles.second_img_wrapper], promo1Wrapper, promo2Wrapper);
    return wrapper;
  }

  private setLinksBlock() {
    const wrapper = div([styles.links_wrapper]);

    const elements = [
      {
        text: span([styles.links_text], 'For Kids'),
        img: new BaseComponent<HTMLImageElement>({ tag: 'img', src: imgKids }),
      },
      {
        text: span([styles.links_text], 'Vegan'),
        img: new BaseComponent<HTMLImageElement>({ tag: 'img', src: imgVegan }),
      },
      {
        text: span([styles.links_text], 'On sale'),
        img: new BaseComponent<HTMLImageElement>({ tag: 'img', src: imgSale }),
      },
    ];
    const numberBlocksFroAnim = [styles.block1, styles.block2, styles.block3];

    elements.forEach((elem, index) => {
      const element = new BaseComponent<HTMLDivElement>(
        { className: styles.links_block },
        elem.text,
        div([styles.links_img_wrapper], elem.img)
      );
      element.addClass(numberBlocksFroAnim[index]);
      element.getNode().setAttribute(`data-link`, elem.text.getNode().textContent as string);
      wrapper.append(element);
    });

    wrapper.addListener('click', (e: Event) => this.categoriesHandler(e));
    return wrapper;
  }

  private categoriesHandler(e: Event) {
    const target = e.target as HTMLElement;
    const parent = (target?.closest(`.${styles.links_block}`) as HTMLElement)?.dataset.link;

    if (!parent) {
      return;
    }
    switch (parent) {
      case 'For Kids':
        this.navigateToCatalog('IS_KIDS');
        break;
      case 'Vegan':
        this.navigateToCatalog('IS_VEGAN');
        break;
      case 'On sale':
        this.navigateToCatalog('IS_SALE');
        break;
      default:
        break;
    }
  }

  private navigateToCatalog(filter: string) {
    this.router.setEmptyUrlCatalog();
    this.router.setUrlCatalog(filter);
    this.router.navigateToLastPoint();
  }
}
