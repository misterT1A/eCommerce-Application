import Modal from '@components/modal/modal';
import setLoader from '@utils/loader/loader-view';

const modalConstructor = () => {
  const props = {
    title: 'No network connection',
    content: setLoader(),
    withoutCloseBtn: true,
  };
  return new Modal(props);
};

export default modalConstructor;
