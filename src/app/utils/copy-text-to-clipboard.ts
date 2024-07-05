import notificationEmitter from '@components/notifications/notifications-controller';

export default async function copyTextInClipboard(text: string, notification: string) {
  try {
    await window.navigator.clipboard.writeText(text);
    notificationEmitter.showMessage({ messageType: 'info', text: notification, title: 'Copied!' });
  } catch {
    console.log('Failed to copy text');
  }
}
