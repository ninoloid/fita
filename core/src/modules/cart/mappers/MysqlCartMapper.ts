import {StaticImplements} from '../../../domain/decorators/StaticImplements';
import {Mapper} from '../../../domain/Mapper';
import {UniqueEntityId} from '../../../domain/UniqueEntityId';
import {Cart} from '../domains/Cart';

export interface MysqlCartProps {
  id: string;
  total_price: number;
  checked_out: number;
  paid: number;

  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

@StaticImplements<Mapper<Cart, MysqlCartProps>>()
export class MysqlCartMapper {
  public static toDomain(props: MysqlCartProps): Cart {
    const cartOrError = Cart.create(
      {
        totalPrice: props.total_price,
        checkedOut: props.checked_out == 1 ? true : false,
        paid: props.paid == 1 ? true : false,

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

  public static toPersistence(domain: Cart): MysqlCartProps {
    return {
      id: domain.id.toString(),
      total_price: domain.totalPrice,
      checked_out: domain.checkedOut ? 1 : 0,
      paid: domain.paid ? 1 : 0,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
      deleted_at: domain.deletedAt,
    };
  }
}
