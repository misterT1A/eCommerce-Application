import type MessageView from './notification-view/notification-view';

class MessagesList {
  private list: WeakSet<MessageView> = new Set();

  constructor(
    private callback: () => void,
    private listSize = 0
  ) {}

  public add(message: MessageView) {
    this.listSize += 1;
    this.list.add(message);
    message.setCloseCallback(() => this.remove(message));
  }

  private remove(message: MessageView) {
    if (this.list.has(message)) {
      message.remove();
      this.list.delete(message);
      this.listSize -= 1;
      this.callback();
    }
  }

  public get size(): number {
    return this.listSize;
  }
}

export default MessagesList;
