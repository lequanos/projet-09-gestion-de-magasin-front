export type GetProductStatsResponse = {
  activeProductsCount: number;
  productsCount: number;
  progression: number;
  [key: string]: number;
};
