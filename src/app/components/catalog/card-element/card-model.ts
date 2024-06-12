// import type BaseComponent from '@utils/base-component';

const setShortDescription = (text: string | undefined) => {
  if (!text) {
    return 'No description';
  }
  return text.length > 30 ? `${text.slice(0, 30)}...` : text;
};

const setPrice = (price: number | undefined, text?: string) => {
  if (!price) {
    return text || 'Not for sale';
  }

  return `${(price / 100).toFixed(2)} €`;
};

const changeCount = (countParrent: HTMLElement | null, plus: boolean) => {
  if (!countParrent) {
    return;
  }
  const countElem = countParrent.children[1];
  const count = countElem.textContent;
  if (plus) {
    if (count) {
      countElem.textContent = (+count + 1).toString();
    }
  } else if (count && +count > 1) {
    countElem.textContent = (+count - 1).toString();
  }
};

export { setShortDescription, setPrice, changeCount };
