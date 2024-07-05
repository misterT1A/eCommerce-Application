import BaseComponent from '@utils/base-component';
import throttle from '@utils/throttle';

import styles from './progress-bar-styles.scss';

export default class ProgressBar extends BaseComponent<HTMLDivElement> {
  protected progress: BaseComponent;

  protected optimizedHandler: (...args: Parameters<typeof this.recalculateProgress>) => void;

  constructor() {
    super({ tag: 'div', className: styles.wrapper });

    this.progress = new BaseComponent<HTMLDivElement>({
      tag: 'div',
      className: styles.progress_line,
    });
    this.append(this.progress);

    this.optimizedHandler = throttle(() => this.recalculateProgress(), 100);

    window.addEventListener('scroll', () => this.optimizedHandler());
    window.addEventListener('resize', () => this.optimizedHandler());
  }

  private setValue(value: number) {
    (this.progress.getNode() as HTMLDivElement).style.width = `${value}%`;
  }

  private recalculateProgress() {
    const viewportHeight = window.innerHeight;
    const pageHeight = document.body.offsetHeight;
    const currentPosition = window.scrollY;

    const availableHeight = pageHeight - viewportHeight;

    const percent = (currentPosition / availableHeight) * 100;

    this.setValue(percent);
  }
}
