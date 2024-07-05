import MessagesList from '../messages-list';
import MessageView from '../notification-view/notification-view';

describe('MessagesList', () => {
  let messagesList: MessagesList;

  beforeEach(() => {
    messagesList = new MessagesList(jest.fn());
  });

  it('Should add a message and set close callback', () => {
    const message = new MessageView({ messageType: 'error', text: 'some text' });
    messagesList.add(message);
    expect(messagesList.size).toBe(1);
    message.closeButton.getNode().click();
    expect(messagesList.size).toBe(0);
  });
});
