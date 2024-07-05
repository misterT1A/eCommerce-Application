interface INotificationProps {
  /**
   *	The type of the notification.
   */
  messageType: 'error' | 'success' | 'warning' | 'info';
  /**
   *	The text content of the notification.
   */
  text: string;
  /**
   *	The title of the notification (optional).
   */
  title?: string;
  /**
   *	The duration in ms for which the notification should be displayed (default = 15000ms).
   */
  duration?: number;
}
