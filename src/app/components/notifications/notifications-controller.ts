import Queue from '@utils/queue';

import MessagesList from './messages-list';
import MessageView from './notification-view/notification-view';
import NotificationContainer from './notification-view/notifications-container';

class Notifications {
  private pendingNotifications: Queue<MessageView>;

  private activeNotifications: MessagesList;

  private messagesContainer: NotificationContainer;

  constructor() {
    this.activeNotifications = new MessagesList(() => this.handlePendingQueue());
    this.pendingNotifications = new Queue();
    this.messagesContainer = new NotificationContainer();
    document.body.append(this.messagesContainer.getNode());
  }

  /**
   * Displays a notification message.
   * __________
   * @param {INotificationProps} props - The properties of the notification.
   * @property {string} text - The main text content of the notification.
   * @property {string} [title] - The optional title of the notification.
   * @property {'error' | 'success' | 'warning' | 'info'} messageType - The type of the notification.
   *    It can be one of 'error', 'success', 'warning', or 'info'.
   * @property {number} [duration] - The duration for which the notification should be displayed,
   *    in milliseconds. This property is optional, and if not provided, it will be set to 15000ms.
   * _________
   * @example
   * notificationEmitter.showMessage({messageType: 'error', text: 'error text'});
   * notificationEmitter.showMessage({messageType: 'success', title: 'Account was created!', text: 'some text ...'});
   */

  public showMessage(props: INotificationProps) {
    const message = new MessageView(props);
    this.pendingNotifications.enqueue(message);
    this.handlePendingQueue();
  }

  private handlePendingQueue() {
    if (this.activeNotifications.size < 5 && this.pendingNotifications.size) {
      const message = this.pendingNotifications.dequeue();
      if (!message) {
        return;
      }
      this.activeNotifications.add(message);
      this.messagesContainer.append(message);
    }
  }
}

const notificationEmitter = new Notifications();

export default notificationEmitter;
