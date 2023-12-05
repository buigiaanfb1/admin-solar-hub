// ----------------------------------------------------------------------
export type ProductManager = {
  productId: string;
  name: string;
  price: number;
  manufacturer: string;
  feature: string;
  warrantyDate: Date;
  status: boolean;
  image: Image[];
  productWarrantyReport: [];
};

export type Image = {
  imageId: string;
  imageData: string;
  productId: string;
  processId: string | null;
  bracketId: string | null;
  warrantyReportId: string | null;
  bracket: string | null;
  process: string | null;
  warrantyReport: string | null;
};
