import {date, object, string, number} from 'joi';
import {Entity} from '../../../domain/Entity';
import {UniqueEntityId} from '../../../domain/UniqueEntityId';
import {DomainError} from '../../../errors/DomainError';
import {Guard} from '../../../logic/Guard';
import {Result} from '../../../logic/Result';

export interface ProductProps {
  sku: string;
  name: string;
  price: number;
  quantity: number;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export class Product extends Entity<ProductProps> {
  private static SCHEMA = object<ProductProps>({
    sku: string().required(),
    name: string().required(),
    price: number().required(),
    quantity: number().required(),

    createdAt: date().optional(),
    updatedAt: date().optional(),
    deletedAt: date().allow(null).optional(),
  }).required();

  get id(): UniqueEntityId {
    return this._id;
  }

  get sku(): string {
    return this.props.sku;
  }

  get name(): string {
    return this.props.name;
  }


  get price(): number {
    return this.props.price;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  public static create(
    props: ProductProps,
    id?: UniqueEntityId,
  ): Result<Product> {
    const guardResult = Guard.againstSchema<ProductProps>(this.SCHEMA, props);
    if (!guardResult.succeeded) {
      return Result.fail(
        new DomainError(guardResult.message!, guardResult.errors),
      );
    } else {
      props = guardResult.value!;
      const product = new Product(
        {
          ...props,
          createdAt: props.createdAt ? props.createdAt : new Date(),
          updatedAt: props.updatedAt ? props.updatedAt : new Date(),
        },
        id,
      );

      return Result.ok(product);
    }
  }
}
