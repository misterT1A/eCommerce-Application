import { CATEGORIES, FILTERS, SORT, SUBCATEGORIES } from '@components/catalog/filters/constants-filters';
import { isPriceFilter } from '@components/catalog/filters/price-filter-helpers';

type filtersObj = typeof SORT | typeof CATEGORIES | typeof SUBCATEGORIES;

const isDeleteElem = (parsePath: string[], filter: string) => {
  const elemForDelete = parsePath.find((elem) => elem === filter);
  if (elemForDelete) {
    parsePath.splice(parsePath.indexOf(elemForDelete), 1);
    return true;
  }

  return false;
};

const changeElem = (parsePath: string[], filter: string, filtersObj: filtersObj) => {
  const sortElemForChange = parsePath.find((elem) => elem in filtersObj);
  if (sortElemForChange) {
    parsePath.splice(parsePath.indexOf(sortElemForChange), 1, filter);
  } else {
    parsePath.push(filter);
  }
};

const setSort = (parsePath: string[], filter: string) => {
  const isDeleteFilter = isDeleteElem(parsePath, filter);

  if (!isDeleteFilter) {
    changeElem(parsePath, filter, SORT);
  }
};

const setCategoties = (parsePath: string[], filter: string) => {
  const isDeleteFilter = isDeleteElem(parsePath, filter);

  if (!isDeleteFilter) {
    changeElem(parsePath, filter, CATEGORIES);
  }
  const subElem = parsePath.find((elem) => elem in SUBCATEGORIES);
  if (subElem) {
    parsePath.splice(parsePath.indexOf(subElem), 1);
  }
};

const setSubCategories = (parsePath: string[], filter: string) => {
  const isDeleteFilter = isDeleteElem(parsePath, filter);
  if (!isDeleteFilter) {
    changeElem(parsePath, filter, SUBCATEGORIES);
  }
};

const setFilters = (parsePath: string[], filter: string) => {
  const isDeleteFilter = isDeleteElem(parsePath, filter);
  if (!isDeleteFilter) {
    parsePath.push(filter);
  }
};

const setParseRange = (parsePath: string[], range: string) => {
  const i = parsePath.findIndex((el) => el.startsWith('PRICE'));
  if (i === -1) {
    parsePath.push(range);
  } else {
    parsePath.splice(i, 1, range);
  }
};

const checkRightURL = (url: string): boolean => {
  const path = url.split('/').splice(1);
  const params = [
    ...Object.keys(FILTERS),
    ...Object.keys(CATEGORIES),
    ...Object.keys(SUBCATEGORIES),
    ...Object.keys(SORT),
  ];

  return path.every((elem) => params.includes(elem) || isPriceFilter(elem));
};

const sortUrl = (parsePath: string[]): string => {
  const url = parsePath;
  const sortKeys = Object.keys(SORT);
  const categoryKeys = Object.keys(CATEGORIES);
  const filterKeys = Object.keys(FILTERS);
  const subCategKeys = Object.keys(SUBCATEGORIES);

  const category = url.find((elem) => categoryKeys.includes(elem)) || '';
  const subCategory = url.find((elem) => subCategKeys.includes(elem)) || '';
  const sortFilters = url.find((elem) => sortKeys.includes(elem)) || '';
  const priceFilter = url.find((elem) => isPriceFilter(elem)) || '';

  const filters = url
    .map((elem) => (filterKeys.includes(elem) ? elem : null))
    .filter((elem) => elem !== null)
    .join('/');

  return [category, subCategory, filters, sortFilters, priceFilter].filter((elem) => elem !== '').join('/');
};

export { setSort, setCategoties, setSubCategories, setFilters, setParseRange, checkRightURL, sortUrl };
