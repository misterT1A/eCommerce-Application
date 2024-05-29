import BaseComponent from '@utils/base-component';
import { button, div, h2, svg } from '@utils/elements';

import styles from './_modal.scss';

interface IModalProps<T extends BaseComponent> {
  title: string;

  content: T;

  withoutCloseBtn?: boolean;
}

class Modal<T extends BaseComponent> extends BaseComponent {
  public modal: BaseComponent<HTMLElement>;

  constructor(modalProps: IModalProps<T>) {
    super({ tag: 'div', className: styles.overlay });
    this.modal = div([styles.modal]);
    const header = div([styles.modal__header]);
    const closeButton = button([styles.modal__close], '', { type: 'button' });
    closeButton.append(svg(`/assets/img/notif-close.svg#close`, styles.modal__closeIcon));
    closeButton.addListener('click', () => this.close());
    if (modalProps.title) {
      header.append(h2([styles.modal__title], modalProps.title));
    }
    this.modal.append(header);
    if (modalProps.content) {
      this.modal.append(modalProps.content);
    }

    if (!modalProps.withoutCloseBtn) {
      header.append(closeButton);
    }

    this.append(this.modal);
  }

  public open() {
    document.body.append(this.getNode());
  }

  public close() {
    this.addClass(styles.overlay__hide);
    setTimeout(() => {
      this.destroy();
    }, 300);
  }
}

export default Modal;
