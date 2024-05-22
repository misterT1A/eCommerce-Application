interface ICardProps {
  img: IImgCard[];
  title: string;
  description: string;
  price?: number;
}

interface IImgCard {
  url: string;
}
