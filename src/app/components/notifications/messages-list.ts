import type MessageView from './notification-view/notification-view';

class MessagesList {
  private list: WeakSet<MessageView> = new Set();

  constructor(
    private callback: () => void,
    private listsize = 0
  ) {}

  public add(message: MessageView) {
    this.listsize += 1;
    this.list.add(message);
    message.setCloseCallback(() => this.remove(message));
  }

  private remove(message: MessageView) {
    if (this.list.has(message)) {
      message.remove();
      this.list.delete(message);
      this.listsize -= 1;
      this.callback();
    }
  }

  public get size(): number {
    return this.listsize;
  }
}

export default MessagesList;
