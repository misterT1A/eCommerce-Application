import BaseComponent from '@utils/base-component';

import styles from '../_notifications.scss';

class NotificationContainer extends BaseComponent<HTMLElement> {
  constructor() {
    super({ tag: 'div', className: styles.notifications__container });
  }
}

export default NotificationContainer;
