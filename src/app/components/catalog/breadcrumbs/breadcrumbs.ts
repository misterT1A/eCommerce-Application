import BaseComponent from '@utils/base-component';
import { span } from '@utils/elements';

import styles from './_breadcrumbs.scss';

export default class Breadcrumbs extends BaseComponent {
  private ul: BaseComponent<HTMLUListElement>;

  private li: BaseComponent<HTMLLIElement>[];

  constructor() {
    super({ tag: 'div', className: styles.breadcrumbsBlock });
    this.li = [new BaseComponent<HTMLLIElement>({ tag: 'li', className: styles.li }, span([], 'CATALOG'))];
    this.li.forEach((li) => li.addListener('click', () => console.log(this.li)));
    this.ul = new BaseComponent<HTMLUListElement>({ tag: 'ul', className: styles.ul }, ...this.li);
    this.ul.addClass(styles.fd);

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
        liElement.addListener('click', () => console.log(liElement));
        this.ul.append(liElement);
      });
    });
  }

  // TODO
  // public handleBreadcrumbChange(name: string) {}

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
