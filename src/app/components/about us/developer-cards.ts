import artem from '@assets/team-photos/artem.jpg';
import tania from '@assets/team-photos/tania.jpg';
import icon from '@assets/userIcon.svg';
import { a, div, img, p, span, svg } from '@utils/elements';

import styles from './_about_us-styles.scss';

const TEAM_DESCRIPTION = `We are a team of three developers currently completing our development course. This website is our final project, showcasing what we’ve learned and achieved through our collaborative efforts and detailed planning.

Our development process was highly collaborative, utilizing task planning and management tools such as Kanban boards. These tools helped us organize and prioritize our tasks efficiently, ensuring steady progress and meeting our milestones.

Communication has been key to our success. We maintained constant contact through regular meetings and messaging platforms, allowing us to quickly address any challenges and share updates. Our ability to work together effectively has been crucial in bringing this project to life.

We’re excited to present our project and hope you enjoy exploring our work!`;

const developer1 = () =>
  div(
    [styles.card, styles.card_even],
    div(
      [styles.card_content],
      p([styles.card_content_name], 'Artem Taraskin'),
      p([styles.card_content_role], 'Team Lead, Frontend Developer'),
      p(
        [],
        'I graduated from Technical University with a degree in shipbuilding and ocean engineering. I have been studying frontend since the beginning of 2023.'
      ),
      p(
        [],
        'Contribution to the project: Development environment configuration, Repository setup, Navigation and Header implementation, Routing implementation, Main page, Catalog page (Product List, lazy loading, Interactive product cards), Product page (Information), Cart page (Items and Information).'
      ),
      a([], {
        href: '',
        isExternal: true,
        icon: svg('assets/img/github.svg#gh', styles.card_content_github),
      })
    ),
    img([styles.photo], artem)
  );

const developer2 = () =>
  div(
    [styles.card, styles.card_odd],
    div(
      [styles.card_content, styles.card_content_odd],
      p([styles.card_content_name], 'Name'),
      p([styles.card_content_role], 'Frontend Developer'),
      p([], 'Biography'),
      p([], 'Contribution to the project:'),
      a([], {
        href: '',
        isExternal: true,
        icon: svg('assets/img/github.svg#gh', styles.card_content_github),
      })
    ),
    img([styles.photo, styles.photo_odd], icon)
  );

const developer3 = () =>
  div(
    [styles.card, styles.card_even],
    div(
      [styles.card_content],
      div([], span([styles.card_content_name], 'Tatsiana Skavarodka')),
      p([styles.card_content_role], 'Frontend Developer'),
      p(
        [],
        'Graduated Dental faculty of Medical university. Started learning frontend development at The Rolling Scopes School in 2023.'
      ),
      p(
        [],
        'Contribution to the project: CommerceTools project setup, Authentication, Login page, Catalog page (categories navigation, products filtering, sorting and searching), Product page (Swiper integration), Cart page (promo codes application), About Us page.'
      ),
      a([], {
        href: 'https://github.com/tatsianask108',
        isExternal: true,
        icon: svg('assets/img/github.svg#gh', styles.card_content_github),
      })
    ),
    img([styles.photo], tania)
  );

const getCards = () => [developer1(), developer2(), developer3()];

export { getCards, TEAM_DESCRIPTION };
