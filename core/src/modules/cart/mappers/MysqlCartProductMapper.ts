import {StaticImplements} from '../../../domain/decorators/StaticImplements';
import {Mapper} from '../../../domain/Mapper';
import {UniqueEntityId} from '../../../domain/UniqueEntityId';
import {CartProduct} from '../domains/CartProduct';

export interface MysqlCartProductProps {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;

  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

@StaticImplements<Mapper<CartProduct, MysqlCartProductProps>>()
export class MysqlCartProductMapper {
  public static toDomain(props: MysqlCartProductProps): CartProduct {
    const cartOrError = CartProduct.create(
      {
        cartId: new UniqueEntityId(props.cart_id),
        productId: new UniqueEntityId(props.product_id),
        quantity: props.quantity,

        createdAt: props.created_at,
        updatedAt: props.updated_at,
        deletedAt: props.deleted_at,
      },
      new UniqueEntityId(props.id),
    );

    if (cartOrError.isFailure) {
      throw cartOrError.errorValue();
    } else {
      return cartOrError.getValue();
    }
  }

  public static toPersistence(domain: CartProduct): MysqlCartProductProps {
    return {
      id: domain.id.toString(),
      cart_id: domain.cartId.toString(),
      product_id: domain.productId.toString(),
      quantity: domain.quantity,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
      deleted_at: domain.deletedAt,
    };
  }
}
