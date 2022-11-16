export type GetAllStoreResponse = StoreResponse[];

type StoreResponse = {
  id: number;
  address: string;
  city: string;
  createdAt: Date;
  isActive: boolean;
  name: string;
  pictureUrl: string;
  postcode: string;
  siren: string;
  siret: string;
  updatedAt: Date;
};
