import styles from './_modal.scss';
/**
 * Controls the locking and unlocking of the scroll position on the page.
 *
 * This utility is useful for preventing the page from scrolling when a modal or
 * other overlay is open, and then restoring the scroll position when the overlay
 * is closed.
 *
 * @example
 * // Create an instance of scrollControl
 * const scrollController = scrollControl();
 *
 * // Lock the scroll position when showing something
 * openButton.addListener('click', () => {
 *   scrollController.lock();
 *   // show component ...
 * });
 *
 * // Unlock the scroll position when hiding something
 * closeButton.addListener('click', () => {
 *   scrollController.unlock();
 *   // hide component ...
 * });
 */
export default function scrollControl() {
  let scroll = 0;
  return {
    /**
     * Locks the scroll position of the page.
     */
    lock() {
      scroll = window.scrollY;
      document.body.style.top = `-${scroll}px`;
      document.body.classList.add(styles.bodyLock);
    },
    /**
     * Unlocks the scroll position of the page.
     */
    unlock() {
      document.body.classList.remove(styles.bodyLock);
      window.scrollTo({ top: scroll, behavior: 'instant' });
    },
  };
}

export function lockBackground(background?: HTMLElement) {
  const element = background;
  if (element) {
    element.inert = true;
  }
}

export function unlockBackground(background?: HTMLElement) {
  const element = background;
  if (element) {
    element.inert = false;
  }
}
