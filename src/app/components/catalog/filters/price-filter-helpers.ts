import type {
  ClientResponse,
  ProductProjectionPagedSearchResponse,
  RangeFacetResult,
} from '@commercetools/platform-sdk';

import FormSelection from '@components/form-ui-elements/formSelection';
import RangeSelector from '@components/form-ui-elements/range-selector';
import ProductService from '@services/product_service/product_service';

export enum SORT_SELECTION {
  TITLE = 'Sort By',
  PRICE_DESC = 'Descending price',
  PRICE_ASC = 'Ascending price',
  A_Z = 'A-Z',
  Z_A = 'Z-A',
}

export const getPriceSelector = () =>
  new RangeSelector({
    min: 0,
    max: 10000,
    isInputInCents: true,
    unit: '€',
    name: 'Price',
  });

export const getSortSelector = () =>
  new FormSelection(SORT_SELECTION.TITLE, [
    SORT_SELECTION.PRICE_DESC,
    SORT_SELECTION.PRICE_ASC,
    SORT_SELECTION.A_Z,
    SORT_SELECTION.Z_A,
  ]);

export const isPriceFilter = (filter: string) => {
  const pattern = /^PRICE_\d+_\d+$/;
  return pattern.test(filter);
};

export function updatePriceRange(data: ClientResponse<ProductProjectionPagedSearchResponse>) {
  const { facets } = data.body;
  if (facets && facets['variants.price.centAmount']) {
    const priceRangeFacet = facets['variants.price.centAmount'] as RangeFacetResult;
    const { min, max } = priceRangeFacet.ranges[0];
    ProductService.setPriceMaxRange([min, max]);
  }
}

export function getPriceFromUrl(string: string) {
  if (string.startsWith('PRICE')) {
    const range = string
      .split('_')
      .slice(1)
      .map((bound) => parseInt(bound, 10)) as [number, number];
    console.log(range);
    return range;
  }
  return ProductService.priceBounds;
}

export function getPriceFilter() {
  return `PRICE_${ProductService.getPriceRange()[0]}_${ProductService.getPriceRange()[1]}`;
}
