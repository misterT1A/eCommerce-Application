import aliona from '@assets/team-photos/aliona.jpg';
import artem from '@assets/team-photos/artem.jpg';
import tania from '@assets/team-photos/tania.jpg';
// import icon from '@assets/userIcon.svg';
import { a, div, img, li, p, span, svg, ul } from '@utils/elements';

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
      // p(
      //   [],
      //   'Contribution to the project: Development environment configuration, Repository setup, Navigation and Header implementation, Routing implementation, Main page, Catalog page (Product List, lazy loading, Interactive product cards), Product page (Information), Cart page (Items and Information).'
      // ),
      ul(
        [styles.contribution],
        li([styles.contribution_tag], span([], 'repository setup')),
        li([styles.contribution_tag], span([], 'development environment configuration')),
        li([styles.contribution_tag], span([], 'Navigation and Header')),
        li([styles.contribution_tag], span([], 'Routing implementation')),
        li([styles.contribution_tag], span([], 'Catalog page')),
        li([styles.contribution_tag], span([], 'Product page')),
        li([styles.contribution_tag], span([], 'Cart page')),
        li([styles.contribution_tag], span([], 'Interactive product cards')),
        li([styles.contribution_tag], span([], 'routing integration with catalog filters')),
        li([styles.contribution_tag], span([], 'network disconnection handling')),
        li([styles.contribution_tag], span([], 'animations implementation'))
      ),
      a([], {
        href: 'https://github.com/misterT1A',
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
      p([styles.card_content_name], 'Elena Vileishikova'),
      p([styles.card_content_role], 'Frontend Developer'),
      p(
        [],
        'I graduated from the Faculty of Physics at Belarusian State University and worked as a researcher for a few years. Since starting to learn JavaScript last year with Rolling Scopes School, I’ve enjoyed creating dynamic and user-friendly interfaces and finding original solutions to development challenges.'
      ),
      ul(
        [styles.contribution],
        li([styles.contribution_tag], span([], 'jest and eslint configuration')),
        li([styles.contribution_tag], span([], 'layout design (Figma)')),
        li([styles.contribution_tag], span([], 'reusable UI form components')),
        li([styles.contribution_tag], span([], 'notification service')),
        li([styles.contribution_tag], span([], 'customer registration')),
        li([styles.contribution_tag], span([], 'form validation service')),
        li([styles.contribution_tag], span([], 'profile page')),
        li([styles.contribution_tag], span([], 'addresses managing')),
        li([styles.contribution_tag], span([], 'CRUD operations for cart entries')),
        li([styles.contribution_tag], span([], 'errors handling'))
      ),
      a([], {
        href: 'https://github.com/alv0425',
        isExternal: true,
        icon: svg('assets/img/github.svg#gh', styles.card_content_github),
      })
    ),
    img([styles.photo, styles.photo_odd], aliona)
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
      // p(
      //   [],
      //   'Contribution to the project: CommerceTools project setup, Authentication, Login page, Catalog page (categories navigation, products filtering, sorting and searching), Product page (Swiper integration), Cart page (promo codes application), About Us page.'
      // ),
      ul(
        [styles.contribution],
        li([styles.contribution_tag], span([], 'CommerceTools project setup')),
        li([styles.contribution_tag], span([], 'authentication service')),
        li([styles.contribution_tag], span([], 'authentication tokens handling')),
        li([styles.contribution_tag], span([], 'login page')),
        li([styles.contribution_tag], span([], 'catalog page')),
        li([styles.contribution_tag], span([], 'categories navigation')),
        li([styles.contribution_tag], span([], 'products filtering, sorting and searching')),
        li([styles.contribution_tag], span([], 'product page (Swiper integration)')),
        li([styles.contribution_tag], span([], 'promo codes application')),
        li([styles.contribution_tag], span([], 'about us page'))
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
