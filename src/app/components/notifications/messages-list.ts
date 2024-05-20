import type MessageView from './notification-view/notification-view';

class MessagesList {
  private list: Set<MessageView> = new Set();

  constructor(private callback: () => void) {}

  public add(message: MessageView) {
    this.list.add(message);
    message.setCloseCallback(() => this.remove(message));
  }

  private remove(message: MessageView) {
    if (this.list.has(message)) {
      message.remove();
      this.list.delete(message);
      this.callback();
    }
  }

  public get size(): number {
    return this.list.size;
  }
}

export default MessagesList;
