import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { div, h2, p } from '@utils/elements';

import styles from './_about_us-styles.scss';
import { cards, teamDescription } from './developer-cards';

export default class AboutUsView extends BaseComponent {
  constructor(protected router: Router) {
    super({ className: styles.wrapper });
    this.setContent();
  }

  private setContent() {
    const title = h2([styles.title], 'Our team');
    const description = p([styles.description], teamDescription);
    const cardsBlock = this.setCardsBlock();

    this.appendChildren([title, description, cardsBlock]);
  }

  private setCardsBlock() {
    const cardsBlock = div([styles.cards_wrapper], ...cards);

    return cardsBlock;
  }
}
