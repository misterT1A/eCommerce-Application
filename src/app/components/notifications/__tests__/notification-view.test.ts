import styles from '../notification-view/_notifications.scss';
import MessageView from '../notification-view/notification-view';

describe('MessageView', () => {
  let messageView: MessageView;
  let props: INotificationProps;

  beforeEach(() => {
    props = {
      messageType: 'info',
      text: 'Test notification',
      title: 'Test Title',
      duration: 5000,
    };
    messageView = new MessageView(props);
  });

  it('Constructor should initialize and render the notification message correctly', () => {
    expect(messageView.getNode().classList.contains(styles.notification__message)).toBe(true);
    expect(messageView.getNode().classList.contains(styles.notification__message_info)).toBe(true);
    expect(messageView.getNode().querySelector(`.${styles.notification__title}`)?.textContent).toBe(props.title);
    expect(messageView.getNode().querySelector(`.${styles.notification__Text}`)?.textContent).toBe(props.text);
  });

  it('The setCloseCallback should set close callback and trigger it on animation end and close button click', () => {
    const mockCallback = jest.fn();
    messageView.setCloseCallback(mockCallback);
    const event = new Event('animationend');
    messageView['progress'].getNode().dispatchEvent(event);
    expect(mockCallback).toHaveBeenCalled();
    messageView['closeButton'].getNode().click();
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  it('Should set correct animation duration', () => {
    expect(messageView['progress'].getNode().style.animationDuration).toBe(`${props.duration}ms`);
  });

  it('The remove method should remove the notification message', () => {
    jest.useFakeTimers();
    messageView.remove();
    expect(messageView.getNode().classList.contains(styles.notification__messageHide)).toBe(true);
    jest.advanceTimersByTime(200);
    expect(messageView.getNode().isConnected).toBe(false);
    jest.useRealTimers();
  });
});
