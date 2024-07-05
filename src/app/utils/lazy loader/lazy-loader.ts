import BaseComponent from '@utils/base-component';

import styles from './_style.scss';

const setLazyLoader = () => {
  const loaderWrapper = new BaseComponent({ className: styles.loader });

  return loaderWrapper;
};

export default setLazyLoader;
