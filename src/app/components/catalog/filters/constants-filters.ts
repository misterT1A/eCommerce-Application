const FILTERS = {
  IS_VEGAN: 'variants.attributes.Vegan:true',
  IS_KIDS: 'variants.attributes.ForKids:true',
  IS_SALE: 'variants.scopedPriceDiscounted:true',
  BREAD: 'a666f7a9-3eb2-4cf8-b833-7b8345c41006',
  CIABATTAS: '71bed578-320e-4b12-97d3-5ec5497e8967',
  WHEAT_BREAD: '7e6da294-7122-41ae-87e2-d85cc1332de0',
  BAGUETTES: '31c4d22d-3a0e-4b3b-9581-080d4c128388',
  TARTS_DESSERTS: 'f7f2a91e-19e4-4e36-b1cc-ce8b2e8bec95',
  PASTRIES: 'ffaa6dd9-9015-4152-bc87-d03c6127b235',
  ASSORTED_DESSERTS: 'c94b361b-1286-4c80-a619-25e29c31a505',
  PIES_MUFFINS: '92403488-82e4-4596-8c4d-7b641848e0bf',
  CAKES: '823cbee0-d243-47b3-a0e9-5d476622d609',
  TRUFFLES: '10bf71f6-c30d-4dbe-bd5d-41451630c855',
  NOT_SWEETS: 'fab89308-921b-4dc2-ba43-6841e18d9ca8',
  CROISSANTS: '8330f8e4-6dbc-4bf9-b4ba-e453aea3df8f',
};

const SORT = {
  PRICE_DESC: 'price desc',
  PRICE_ASC: 'price asc',
  A_Z: 'name.en asc',
  Z_A: 'name.en desc',
};

export { FILTERS, SORT };
