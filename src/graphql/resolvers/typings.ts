export interface ICartProductObject {
  productId: string;
  quantity: number;
}

export interface IAddToCartArgs {
  products: ICartProductObject[];
}
