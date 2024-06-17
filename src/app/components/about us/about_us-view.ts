import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { a, div, h2, p, svg } from '@utils/elements';

import styles from './_about_us-styles.scss';
import { TEAM_DESCRIPTION, getCards } from './developer-cards';

export default class AboutUsView extends BaseComponent {
  constructor(protected router: Router) {
    super({ className: styles.wrapper });
    this.setContent();
  }

  private setContent() {
    const title = h2([styles.title], 'Our team');
    const description = p([styles.description], TEAM_DESCRIPTION);

    this.appendChildren([title, description, this.setCardsBlock(), this.setRSSchoolBlock()]);
  }

  private setCardsBlock() {
    const cardsBlock = div([styles.cards_wrapper], ...getCards());
    return cardsBlock;
  }

  private setRSSchoolBlock() {
    return div(
      [styles.RSSchool],
      a([], {
        href: 'https://rs.school/',
        isExternal: true,
        icon: svg('assets/img/rss-logo.svg#svgElem', styles.RSSchool_icon),
      }),
      p([], 'The project was created as part of the training at The Rolling Scopes School in 2024.')
    );
  }
}
