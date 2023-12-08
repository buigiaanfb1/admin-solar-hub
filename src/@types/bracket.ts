import { Image } from './product';

// ----------------------------------------------------------------------
export type BracketManager = {
  bracketId: string;
  name: string;
  price: number;
  manufacturer: string;
  size: number;
  material: string;
  status: boolean;
  constructionContract: Array<any>;
  image: Image[];
  creatAt: Date;
};
