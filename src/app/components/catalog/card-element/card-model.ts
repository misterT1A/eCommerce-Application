// import type BaseComponent from '@utils/base-component';

const setShortDescription = (text: string | undefined) => {
  if (!text) {
    return 'No description';
  }
  return text.length > 30 ? `${text.slice(0, 30)}...` : text;
};

const setPrice = (price: number | undefined, text?: string) => {
  if (!price) {
    return text ?? 'Not for sale';
  }

  return `${(price / 100).toFixed(2)} €`;
};

export { setShortDescription, setPrice };
