import Pages from '@src/app/router/pages';
import type Router from '@src/app/router/router';
import BaseComponent from '@utils/base-component';
import { div, h2, span, ul } from '@utils/elements';

import styles from './_styles.scss';

export default class MainView extends BaseComponent {
  protected router: Router;

  constructor(router: Router) {
    super({ tag: 'section', className: styles.main });
    this.router = router;

    this.setContent();
  }

  private setContent() {
    const props: Props[] = [
      {
        tag: 'li',
        className: styles.links,
        textContent: 'Log In',
      },
      {
        tag: 'li',
        className: styles.links,
        textContent: 'Sign Up',
      },
    ];
    this.append(
      div(
        [styles.main__section],
        div(
          [styles.main__sectionText],
          h2([styles.main__sectionTitle], 'Enjoy breakfast with brioches!'),
          ul([styles.main__sectionLinks], ...props.map((prop) => new BaseComponent<HTMLLIElement>(prop)))
        )
      )
    );
    this.addListener('click', (e: Event) => this.navigate(e));
    this.append(this.setVideo());
  }

  private setVideo() {
    const video = new BaseComponent<HTMLVideoElement>({
      tag: 'video',
      className: styles.video_content,
      autoplay: true,
      muted: true,
      loop: true,
      src: './assets/img/3119255-sd_640_360_25fps.mp4',
    });
    // const img = div([styles.img_content]);
    const title = span([styles.video_title], 'Om Nom Nom');
    const titleWraper = div([styles.video_title_wrapper], title);

    const wrapper = div([styles.video_wrapper], video, titleWraper);
    return wrapper;
  }

  private navigate(e: Event) {
    const target = (e.target as HTMLElement)?.textContent;

    switch (target) {
      case 'Log In':
        this.router.navigate(Pages.LOGIN);
        break;
      case 'Sign Up':
        this.router.navigate(Pages.REG);
        break;
      default:
        break;
    }
  }
}
