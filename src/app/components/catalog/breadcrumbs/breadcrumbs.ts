import BaseComponent from '@utils/base-component';
import { span } from '@utils/elements';
import { transformCategoryName } from '@utils/filters-helpers';

import styles from './_breadcrumbs.scss';
import type CatalogView from '../catalog-view';
import { CATALOG_ROOT, SUBCATEGORIES } from '../filters/constants-filters';

export default class Breadcrumbs extends BaseComponent {
  private ul: BaseComponent<HTMLUListElement>;

  private li: BaseComponent<HTMLLIElement>[];

  constructor(private parent: CatalogView) {
    super({ tag: 'div', className: styles.breadcrumbsBlock });
    this.li = [new BaseComponent<HTMLLIElement>({ tag: 'li', className: styles.li }, span([], CATALOG_ROOT))];
    this.ul = new BaseComponent<HTMLUListElement>({ tag: 'ul', className: styles.ul }, ...this.li);
    this.parent = parent;
    this.append(this.ul);
  }

  public update(array: string[]) {
    this.hideBlock().then(() => {
      this.showBlock();
      this.li = [];
      array.forEach((el) => {
        this.li.push(
          new BaseComponent<HTMLLIElement>(
            { tag: 'li', className: styles.li, textContent: ' / ' },
            span([], `${el.toUpperCase()}`)
          )
        );
      });
      this.li[0].getNode().firstChild?.remove();

      this.ul.destroyChildren();
      this.li.forEach((liElement) => {
        liElement.addListener('click', (e: Event) => this.navigateBreadcrumb(e));
        this.ul.append(liElement);
      });
    });
  }

  private navigateBreadcrumb(e: Event) {
    const target = e.target as HTMLElement;

    if (target.innerText === CATALOG_ROOT) {
      this.parent.getRouter.setEmptyUrlCatalog();
      this.parent.getFilterBlockView.setValues([CATALOG_ROOT]);
      return;
    }

    const path = this.parent.getRouter.getCurrentPath().split('/').splice(1);
    const filteredPath = path.filter((el) => !(el in SUBCATEGORIES));
    this.parent.getRouter.setEmptyUrlCatalog();
    this.parent.getFilterBlockView.setValues([transformCategoryName(target.innerText)]);
    filteredPath.forEach((el) => this.parent.getRouter.setUrlCatalog(el));
  }

  private async hideBlock() {
    this.addClass(styles.hide);
    await new Promise((res) => {
      setTimeout(() => res(true), 600);
    });
  }

  private showBlock() {
    this.removeClass(styles.hide);
  }
}
