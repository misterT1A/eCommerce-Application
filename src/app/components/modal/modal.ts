import BaseComponent from '@utils/base-component';
import { button, div, h2, svg } from '@utils/elements';
import setLoader from '@utils/loader/loader-view';

import styles from './_modal.scss';
import scrollControl, { lockBackground, unlockBackground } from './modal-helpers';

interface IModalProps<T extends BaseComponent> {
  title: string;

  content: T;

  parent?: HTMLElement;

  withoutCloseBtn?: boolean;

  wide?: boolean;

  loader?: boolean;
}

class Modal<T extends BaseComponent> extends BaseComponent {
  public modal: BaseComponent<HTMLElement>;

  private isSubModal = false;

  private scrollControl = scrollControl();

  private static activeModals: Set<Modal<BaseComponent>> = new Set();

  constructor(private modalProps: IModalProps<T>) {
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

    if (modalProps.wide) {
      this.modal.addClass(styles.modal_wide);
    }

    if (modalProps.loader) {
      this.append(setLoader());
      this.addClass(styles.overlay_loader);
    } else {
      this.append(this.modal);
    }
  }

  public static closeModals() {
    this.activeModals.forEach((modal) => modal.close());
  }

  public open() {
    Modal.activeModals.add(this);
    document.body.append(this.getNode());
    lockBackground(this.modalProps.parent);
    this.isSubModal = document.body.classList.contains(styles.bodyLock);
    if (!this.isSubModal && !this.modalProps.loader) {
      this.scrollControl.lock();
    }
  }

  public close() {
    Modal.activeModals.delete(this);
    this.addClass(styles.overlay__hide);
    setTimeout(() => {
      this.destroy();
      if (!this.isSubModal && !this.modalProps.loader) {
        this.scrollControl.unlock();
      }
      unlockBackground(this.modalProps.parent);
    }, 300);
  }
}

export function closeModals() {
  Modal.closeModals();
}

export default Modal;
