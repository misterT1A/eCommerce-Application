import BaseComponent from '@utils/base-component';

import styles from './_loader-style.scss';

const setLoader = (): BaseComponent => {
  const loaderWrapper = new BaseComponent({ className: styles.loader });
  const elemCount = 4;
  for (let i = 0; i < elemCount; i += 1) {
    const elem = new BaseComponent({});
    loaderWrapper.append(elem);
  }

  return loaderWrapper;
};

export default setLoader;
