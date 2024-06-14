import icon from '@assets/userIcon.svg';
import BaseComponent from '@utils/base-component';
import { div, p } from '@utils/elements';

import styles from './_about_us-styles.scss';

const teamDescription = `We are a team of three developers currently completing our development course. This website is our final project, showcasing what we’ve learned and achieved through our collaborative efforts and detailed planning.

Our development process was highly collaborative, utilizing task planning and management tools such as Kanban boards. These tools helped us organize and prioritize our tasks efficiently, ensuring steady progress and meeting our milestones.

Communication has been key to our success. We maintained constant contact through regular meetings and messaging platforms, allowing us to quickly address any challenges and share updates. Our ability to work together effectively has been crucial in bringing this project to life.

We’re excited to present our project and hope you enjoy exploring our work!`;

const image1 = new BaseComponent<HTMLImageElement>({
  tag: 'img',
  className: styles.photo,
  src: icon,
});

const card1 = div(
  [styles.card, styles.card_even],
  div(
    [styles.card_content],
    p([styles.card_content_name], 'Name'),
    p([], 'Team Lead, Frontend Developer'),
    p([], 'Biography'),
    p([], 'Contribution to the project:')
  ),
  image1
);

const image2 = new BaseComponent<HTMLImageElement>({
  tag: 'img',
  className: styles.photo,
  src: icon,
});
image2.addClass(styles.photo_odd);

const card2 = div(
  [styles.card, styles.card_odd],
  div(
    [styles.card_content, styles.card_content_odd],
    p([styles.card_content_name], 'Name'),
    p([], 'Frontend Developer'),
    p([], 'Biography'),
    p([], 'Contribution')
  ),
  image2
);

const image3 = new BaseComponent<HTMLImageElement>({
  tag: 'img',
  className: styles.photo,
  src: icon,
});

const card3 = div(
  [styles.card, styles.card_even],
  div(
    [styles.card_content],
    p([styles.card_content_name], 'Name'),
    p([], 'Frontend Developer'),
    p([], 'Biography'),
    p([], 'Contribution')
  ),
  image3
);

const cards = [card1, card2, card3];

export { cards, teamDescription };
