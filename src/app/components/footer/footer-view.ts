import { CATEGORIES } from '@components/catalog/filters/constants-filters';
import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { div, h2, span, svg } from '@utils/elements';

import styles from './style.scss';

export default class FooterView extends BaseComponent {
  protected router: Router;

  protected linksWrapper = div([styles.wrapper]);

  protected categories: string[] | null;

  constructor(router: Router) {
    super({ tag: 'footer', className: styles.footer });
    this.router = router;
    this.categories = null;
  }

  public setContent() {
    this.categories = Object.keys(CATEGORIES);

    const categoriesBlock = this.setCategoriesBlock();
    const linksBlock = this.setLinksBlock();
    const contactBlock = this.setContactBlock();
    if (categoriesBlock && linksBlock && contactBlock) {
      this.linksWrapper.appendChildren([categoriesBlock, linksBlock, contactBlock]);
    }

    const aboutBlock = this.aboutBlock();

    this.appendChildren([this.linksWrapper, aboutBlock]);
  }

  private setCategoriesBlock(): BaseComponent | null {
    const wrapper = div([styles.categoriesWrapper]);

    if (!this.categories) {
      return null;
    }
    const links = this.categories.map((cat) => cat.replace(/_/g, ' & ').replace(/-/g, ' '));

    links.forEach((cat, index) => {
      const word = cat.charAt(0).toUpperCase() + cat.slice(1);
      const elem = span([styles.link], word);
      elem.getNode().setAttribute(`data-link`, (this.categories as string[])[index]);
      wrapper.append(elem);
    });

    const container = div([styles.block, styles.blockFull], h2([styles.categoriesTitle], 'CATEGORIES'), wrapper);
    wrapper.addListener('click', (e: Event) => this.categoriesHandler(e));

    return container;
  }

  private setLinksBlock(): BaseComponent {
    const wrapper = div([styles.linksWrapper]);
    const links = ['Home', 'Catalog'];
    const catCount = 3;
    for (let i = 0; i < catCount; i += 1) {
      const elem = span([styles.link], links[i]);
      wrapper.append(elem);
    }
    const container = div([styles.block, styles.blockHalf], h2([styles.categoriesTitle], 'LINKS '), wrapper);

    wrapper.addListener('click', (e: Event) => this.LinksHandler(e));

    return container;
  }

  private setContactBlock(): BaseComponent {
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
      svg('/assets/img/point.svg#svgElem', styles.svgIcon),
      svg('/assets/img/phone.svg#svgElem', styles.svgIcon),
      svg('/assets/img/calendar.svg#svgElem', styles.svgIcon),
    ];
    const catCount = 3;
    for (let i = 0; i < catCount; i += 1) {
      const linkBlock = div([styles.contactItem], svgArr[i], links[i]);
      wrapper.append(linkBlock);
    }
    const container = div([styles.block, styles.blockHalf], h2([styles.categoriesTitle], 'CONTACTS '), wrapper);
    // this.linksWrapper.append(container);
    return container;
  }

  private aboutBlock(): BaseComponent {
    const year = span([styles.aboutText], '© 2024 Net Ninjas');
    const nameCourse = span([styles.aboutText], 'Rolling Scopes School');
    const courseLogo = svg('/assets/img/rss-logo.svg#svgElem', styles.aboutLogo);

    const container = div([styles.aboutWrapper], year, nameCourse, courseLogo);
    return container;
  }

  private categoriesHandler(e: Event) {
    const target = (e.target as HTMLElement)?.dataset.link;

    if (!this.categories || !target) {
      return;
    }
    if (this.categories.includes(target)) {
      this.router.setEmptyUrlCatalog();
      this.router.setUrlCatalog(target);
      this.router.navigateToLastPoint();
    }
  }

  private LinksHandler(e: Event) {
    const target = (e.target as HTMLElement)?.textContent;
    switch (target) {
      case 'Home':
        this.router.navigate(Pages.MAIN);
        break;
      case 'Catalog':
        this.router.navigate(Pages.CATALOG);
        break;
      // case 'About Us':
      //   // this.router.navigate(Pages.ABOUT);
      // break;
      default:
        break;
    }
  }
}
