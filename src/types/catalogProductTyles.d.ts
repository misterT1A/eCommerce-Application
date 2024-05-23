interface ICardProps {
  img: IImgCard[];
  title: string;
  description: string;
  price?: number;
}

interface IImgCard {
  url: string;
}

type ResProducts = ClientResponse<ProductProjectionPagedQueryResponse>;
// example  union type
// type ResProducts = ClientResponse<ProductProjectionPagedQueryResponse> | ClientResponse<ProductProjectionPagedQueryResponse>;
