export interface AddToCartDTO {
  products: AddToCartProductDTO[]
}

export interface AddToCartProductDTO {
  productId: string;
  quantity: number;
}
