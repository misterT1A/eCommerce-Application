import { CATEGORIES, FILTERS, SORT, SUBCATEGORIES } from '@components/catalog/filters/constants-filters';

const setSort = (parsePath: string[], filter: string) => {
  const sortElemForDelete = parsePath.find((elem) => elem === filter);

  if (sortElemForDelete) {
    parsePath.splice(parsePath.indexOf(sortElemForDelete), 1);
    return;
  }

  const sortElemForChange = parsePath.find((elem) => elem in SORT);
  if (sortElemForChange) {
    parsePath.splice(parsePath.indexOf(sortElemForChange), 1, filter);
  } else {
    parsePath.push(filter);
  }
};

const setCategoties = (parsePath: string[], filter: string) => {
  const elemForDelete = parsePath.find((elem) => elem === filter);

  if (elemForDelete) {
    parsePath.splice(parsePath.indexOf(elemForDelete), 1);
    const subElem = parsePath.find((elem) => elem in SUBCATEGORIES);
    if (subElem) {
      parsePath.splice(parsePath.indexOf(subElem), 1);
    }
    return;
  }

  const element = parsePath.find((elem) => elem in CATEGORIES);

  if (element) {
    parsePath.splice(parsePath.indexOf(element), 1, filter);

    const subElem = parsePath.find((elem) => elem in SUBCATEGORIES);
    if (subElem) {
      parsePath.splice(parsePath.indexOf(subElem), 1);
    }
  } else {
    parsePath.unshift(filter);
  }
};

const setSubCategories = (parsePath: string[], filter: string) => {
  const elemForDelete = parsePath.find((elem) => elem === filter);

  if (elemForDelete) {
    parsePath.splice(parsePath.indexOf(elemForDelete), 1);
    return;
  }

  const element = parsePath.find((elem) => elem in SUBCATEGORIES);

  if (element) {
    parsePath.splice(parsePath.indexOf(element), 1, filter);
  } else {
    const cutElem = parsePath.find((elem) => elem in CATEGORIES);
    if (cutElem) {
      parsePath.splice(parsePath.indexOf(cutElem) + 1, 0, filter);
    }
  }
};

const setFilters = (parsePath: string[], filter: string) => {
  const filterElemForDelete = parsePath.find((elem) => elem === filter);
  if (filterElemForDelete) {
    parsePath.splice(parsePath.indexOf(filterElemForDelete), 1);
    return;
  }

  const sortElementForAnchor = parsePath.find((elem) => elem in SORT);
  if (sortElementForAnchor) {
    parsePath.splice(parsePath.indexOf(sortElementForAnchor), 0, filter);
  } else {
    parsePath.push(filter);
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

  return path.every((elem) => params.includes(elem));
};

export { setSort, setCategoties, setSubCategories, setFilters, checkRightURL };
