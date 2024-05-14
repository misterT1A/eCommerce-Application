import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { div, h2, span, svg } from '@utils/elements';

import styles from './style.scss';

export default class FooterView extends BaseComponent {
  protected router: Router;

  protected linksWrapper = div([styles.wrapper]);

  protected aboutWrapper = div([styles.aboutWrapper]);

  constructor(router: Router) {
    super({ tag: 'footer', className: styles.footer });
    this.router = router;

    this.setContent();
  }

  private setContent() {
    this.setCategoriesBlock();
    this.setLinksBlock();
    this.setContactBlock();
    this.aboutBlock();

    this.appendChildren([this.linksWrapper, this.aboutWrapper]);
  }

  private setCategoriesBlock() {
    const wrapper = div([styles.categoriesWrapper]);
    const links = [
      'Bread',
      'Muffins & Cupcakes',
      'Biscuits',
      'Pastries',
      'Pies & Tarts',
      'Waffles',
      'Cakes',
      'Rolls & Buns',
      'Vegan',
      'Cookies',
      'Doughnuts',
    ];
    const catCount = 11;
    for (let i = 0; i < catCount; i += 1) {
      const elem = span([styles.link], links[i]);
      wrapper.append(elem);
    }
    const container = div([styles.block, styles.blockFull], h2([styles.categoriesTitle], 'CATEGORIES'), wrapper);
    this.linksWrapper.append(container);
  }

  private setLinksBlock() {
    const wrapper = div([styles.linksWrapper]);
    const links = ['Home', 'Catalog', 'About Us'];
    const catCount = 3;
    for (let i = 0; i < catCount; i += 1) {
      const elem = span([styles.link], links[i]);
      wrapper.append(elem);
    }
    const container = div([styles.block, styles.blockHalf], h2([styles.categoriesTitle], 'LINKS '), wrapper);
    this.linksWrapper.append(container);
    wrapper.addListener('click', (e: Event) => this.LinksHandler(e));
  }

  private setContactBlock() {
    const wrapper = div([styles.linksWrapper]);
    const links = [
      div(
        [styles.contactLink],
        span([styles.linkContact], '42 Baker Street London'),
        span([styles.linkContact], 'NW1 8NJ UK')
      ),
      span([styles.linkContact], '+44 20 8123 4567'),
      div(
        [styles.contactLink],
        span([styles.linkContact], 'Mon-Fri: 7AM-7PM'),
        span([styles.linkContact], 'Sat: 8AM-6PM'),
        span([styles.linkContact], 'Sun: 9AM-5PM')
      ),
    ];
    const svgArr = [
      svg('./assets/img/point.svg#svgElem', styles.svgIcon),
      svg('./assets/img/phone.svg#svgElem', styles.svgIcon),
      svg('./assets/img/calendar.svg#svgElem', styles.svgIcon),
    ];
    const catCount = 3;
    for (let i = 0; i < catCount; i += 1) {
      const linkBlock = div([styles.contactItem], svgArr[i], links[i]);
      wrapper.append(linkBlock);
    }
    const container = div([styles.block, styles.blockHalf], h2([styles.categoriesTitle], 'CONTACTS '), wrapper);
    this.linksWrapper.append(container);
  }

  private aboutBlock() {
    const year = span([styles.aboutText], '© 2024 Net Ninjas');
    const nameCourse = span([styles.aboutText], 'Rolling Scopes School');
    const courseLogo = svg('./assets/img/rss-logo.svg#svgElem', styles.aboutLogo);

    this.aboutWrapper.appendChildren([year, nameCourse, courseLogo]);
    // return [year, nameCourse, courseLogo];
  }
  // TODO categories handler
  // private categoriesHandler() {}

  private LinksHandler(e: Event) {
    const target = (e.target as HTMLElement)?.textContent;
    if (!target) {
      return;
    }

    switch (target) {
      case 'Home':
        this.router.navigate(Pages.MAIN);
        break;
      case 'Catalog':
        // this.router.navigate(Pages.CATALOG);
        break;
      case 'About Us':
        // this.router.navigate(Pages.ABOUT);
        break;
      default:
        break;
    }
  }
}
