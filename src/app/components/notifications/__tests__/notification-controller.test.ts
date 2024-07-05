import notificationEmitter from '../notifications-controller';

describe('MessagesList', () => {
  it('Should enqueue messages in pending notifications list and move to messagesList when its size < 5', async () => {
    notificationEmitter.showMessage({ messageType: 'error', text: 'some text', duration: 500 });
    notificationEmitter.showMessage({ messageType: 'error', text: 'some text', duration: 500 });
    notificationEmitter.showMessage({ messageType: 'error', text: 'some text', duration: 500 });
    expect(notificationEmitter['pendingNotifications'].size).toBe(0);
    expect(notificationEmitter['messagesContainer'].getNode().childNodes.length).toBe(3);
    notificationEmitter.showMessage({ messageType: 'error', text: 'some text', duration: 500 });
    notificationEmitter.showMessage({ messageType: 'error', text: 'some text', duration: 500 });
    notificationEmitter.showMessage({ messageType: 'error', text: 'some text', duration: 500 });
    expect(notificationEmitter['pendingNotifications'].size).toBe(1);
    expect(notificationEmitter['messagesContainer'].getNode().childNodes.length).toBe(5);
    const message = notificationEmitter['messagesContainer'].getNode().childNodes[0];
    (message as HTMLElement).querySelector('button')?.click();
    expect(notificationEmitter['pendingNotifications'].size).toBe(0);
    expect(notificationEmitter['activeNotifications'].size).toBe(5);
  });
});
