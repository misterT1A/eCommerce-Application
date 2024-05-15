# Notifications Component

The Notifications component displays messages in the order they are enqueued in the message queue of the `notification-controller`. The MessagesList class is responsible for displaying messages in the `notificationsContainer` view.
The maximum number of messages that can be displayed in the notifications container is currently set to 5. If the MessagesList reaches its maximum capacity of 5 messages, any additional messages will be queued until space becomes available. This design ensures that important messages are not overlooked due to a crowded notifications display.

The `Notifications` component instance has already been created in `@components/notifications`, `notificationEmitter`.

To use `notificationEmitter` just call method `.showMessage(props)` where props -- `INotificationProps` -- object with fields:

- `messageType: 'error' | 'success' | 'warning' | 'info'` -- The type of the notification.
- `text: string` -- The text content of the notification.
- `title?: string` -- The title of the notification (optional).
- `duration?: number` -- The duration in ms for which the notification should be displayed, optional (default = 15000ms).

## How to use

Import notificationEmitter into your component:

```ts
import notificationEmitter from '@components/notifications/notifications-controller';
```

Then, call the showMessage method and specify the properties.

```ts
notificationEmitter.showMessage({
  messageType: 'success',
  text: 'Notification text here',
});
```
