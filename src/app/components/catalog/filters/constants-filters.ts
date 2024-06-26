export const CATALOG_ROOT = 'CATALOG';

const FILTERS = {
  IS_VEGAN: 'variants.attributes.Vegan:true',
  IS_KIDS: 'variants.attributes.ForKids:true',
  IS_SALE: 'variants.scopedPriceDiscounted:true',
} as const;

const SORT = {
  PRICE_DESC: 'price desc',
  PRICE_ASC: 'price asc',
  A_Z: 'name.en asc',
  Z_A: 'name.en desc',
} as const;

const CATEGORIES: { [key: string]: string } = {};
const SUBCATEGORIES: { [key: string]: { id: string; parentId: string } } = {};

export type FilterKeys = keyof typeof FILTERS;
export type CategoryKey = keyof typeof CATEGORIES;
export type SortKey = keyof typeof SORT;

export { FILTERS, CATEGORIES, SUBCATEGORIES, SORT };
