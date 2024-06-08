import type { ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';

const isNeedAddButton = (body: ProductProjectionPagedSearchResponse): boolean => {
  if (!body || !body.total) {
    return false;
  }
  const cardsOnPage = body.count + body.offset;

  return cardsOnPage < body.total;
};

export default isNeedAddButton;
