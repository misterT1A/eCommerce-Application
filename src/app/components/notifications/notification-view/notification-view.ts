import BaseComponent from '@utils/base-component';
import { button, div, h2, p, svg } from '@utils/elements';

import styles from './_notifications.scss';

enum DefaultNotificationTitle {
  error = 'Error occurred!',
  success = 'Success!',
  info = 'Info:',
  warning = 'Attention!',
}

class MessageView extends BaseComponent<HTMLElement> {
  public closeButton: BaseComponent<HTMLButtonElement>;

  private progress: BaseComponent<HTMLElement>;

  constructor(props: INotificationProps) {
    super({ tag: 'div', className: styles.notification__message });
    this.addClass(styles[`notification__message_${props.messageType}`]);
    this.closeButton = button([styles.notification__close], '', { type: 'button' });
    this.closeButton.append(svg(`/assets/img/notif-close.svg#close`, styles.notification__closeIcon));
    const messageTitle = h2([styles.notification__title], props.title ?? DefaultNotificationTitle[props.messageType]);
    this.appendChildren([
      div(
        [styles.notification__header],
        svg(`/assets/img/notif-${props.messageType}.svg#icon`, styles.notification__headerIcon),
        messageTitle,
        this.closeButton
      ),
      p([styles.notification__Text], props.text),
    ]);
    this.progress = div([styles.notification_progress]);
    this.append(this.progress);
    this.setAnimationDuration(props.duration);
  }

  public setCloseCallback(cb: () => void) {
    this.progress.addListener('animationend', cb);
    this.closeButton.addListener('click', cb);
  }

  public setAnimationDuration(time: number | undefined) {
    this.progress.getNode().style.animationDuration = `${time ?? 2000}ms`;
  }

  public remove() {
    this.addClass(styles.notification__messageHide);
    setTimeout(() => this.destroy(), 200);
  }
}
export default MessageView;
