interface ICardProps {
  key: string;
  img: IImgCard[];
  title: string;
  description: string;
  price: Price | undefined;

  isSelected?: boolean;
  count?: number;
}

interface IImgCard {
  url: string;
}

type ResProducts = ClientResponse<ProductProjectionPagedQueryResponse>;
// example  union type
// type ResProducts = ClientResponse<ProductProjectionPagedQueryResponse> | ClientResponse<ProductProjectionPagedQueryResponse>;

interface IProductAttributes {
  sale?: string;
  vegan?: string;
  kids?: string;
}

interface IFilterOptions {}
