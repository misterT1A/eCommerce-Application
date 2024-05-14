import BaseComponent from '@utils/base-component';
import { button, div, h2, p, svg } from '@utils/elements';

import styles from '../_notifications.scss';

interface INotificationProps {
  title?: string;
  text: string;
  messageType: 'error' | 'success' | 'warning' | 'info';
  confirmButton?: {
    label: string;
    callback: () => void;
  };
}

enum DefaultNotificationTitle {
  error = 'Error occured!',
  success = 'Success!',
  info = 'Info:',

  warning = 'Attention!',
}

class Notification extends BaseComponent<HTMLElement> {
  public closeButton: BaseComponent<HTMLButtonElement>;

  public confirm: BaseComponent<HTMLButtonElement> | null = null;

  constructor(props: INotificationProps) {
    super({ tag: 'div', className: styles.notification__message });
    this.addClass(styles[`notification__message_${props.messageType}`]);
    this.closeButton = button([styles.notification__close], '', { type: 'button' });
    const messageTitle = h2([styles.notification__title], props.title ?? DefaultNotificationTitle[props.messageType]);
    this.appendChildren([
      div(
        [styles.notification__heaher],
        svg(`./assets/img/notif-${props.messageType}.svg#icon`, styles.notification__heaherIcon),
        messageTitle,
        this.closeButton
      ),
      p([styles.notification__Text], props.text),
    ]);
    if (props.confirmButton) {
      this.confirm = button([styles.notification__button], props.confirmButton.label);
      this.confirm.addListener('click', props.confirmButton.callback);
      this.append(this.confirm);
    }
  }
}
export default Notification;
