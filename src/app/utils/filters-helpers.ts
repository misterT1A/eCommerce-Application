import type { SortKey } from '@components/catalog/filters/constants-filters';

enum SORT_SELECTION {
  TITLE = 'Sort By',
  PRICE_DESC = 'Descending price',
  PRICE_ASC = 'Ascending price',
  A_Z = 'A-Z',
  Z_A = 'Z-A',
}

const transformCategoryNamesForView = (array: string[]) =>
  array.map((name) => name.toUpperCase().replace('-', ' ').replace('_', ' & '));

const transformCategoryName = (category: string) => category.toLowerCase().replace(' & ', '_').replace(' ', '-');

const sortProducts = (value: string): SortKey => {
  switch (value) {
    case SORT_SELECTION.PRICE_DESC:
      return 'PRICE_DESC';
    case SORT_SELECTION.PRICE_ASC:
      return 'PRICE_ASC';
    case SORT_SELECTION.A_Z:
      return 'A_Z';
    case SORT_SELECTION.Z_A:
      return 'Z_A';
    default:
      return 'PRICE_DESC';
  }
};

export { transformCategoryNamesForView, transformCategoryName, sortProducts };
