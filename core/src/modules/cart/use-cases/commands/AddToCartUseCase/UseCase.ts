import {array, number, object, string} from 'joi';
import CompositionRoot from '../../../../../application-service/CompositionRoot';
import {BaseUseCase} from '../../../../../domain/BaseUseCase';
import { UniqueEntityId } from '../../../../../domain/UniqueEntityId';
import {ApplicationError} from '../../../../../errors/ApplicationError';
import {Guard} from '../../../../../logic/Guard';
import {Either, left, Result, right} from '../../../../../logic/Result';
import { Cart } from '../../../domains/Cart';
import { CartProduct } from '../../../domains/CartProduct';
import { ICartUnitOfWork } from '../../../unit-of-work/ICartUnitOfWork';
import {AddToCartDTO, AddToCartProductDTO} from './DTO';
import {AddToCartErrors} from './Errors';

type Response = Either<
  | ApplicationError.UnexpectedError
  | ApplicationError.ValidationError,
  Result<AddToCartUseCaseResponse>
>;

export type AddToCartResponse = Response;

export type AddToCartUseCaseResponse = {
  cartId: string,
  totalPrice: number,
};

export class AddToCartUseCase extends BaseUseCase<
  AddToCartDTO,
  AddToCartResponse
> {
  private SCHEMA_PRODUCT = object<AddToCartProductDTO>({
    productId: string().required(),
    quantity: number().required(),
  });

  private SCHEMA = object<AddToCartDTO>({
    products: array().items(this.SCHEMA_PRODUCT).min(1).max(10).required(),
  }).required();

  constructor(protected cartUnitOfWork: ICartUnitOfWork) {
    super('AddToCartUseCase');
  }

  async execute(
    req: AddToCartDTO,
  ): Promise<AddToCartResponse> {
    const methodName = 'execute';
    const traceId = CompositionRoot.getTraceId();
    this.logger.trace({methodName, traceId}, 'BEGIN');

    const guardResult = Guard.againstSchema<AddToCartDTO>(
      this.SCHEMA,
      req,
    );
    if (!guardResult.succeeded) {
      return left(
        new ApplicationError.ValidationError(
          guardResult.message!,
          guardResult.errors,
        ),
      );
    }
    const dto = guardResult.value!;

    try {
      const {
        cartRepository,
        cartProductRepository,
        productQuery,
      } = this.cartUnitOfWork;

      const cartId = new UniqueEntityId();
      let totalPrice: number = 0

      const cartProducts: CartProduct[] = [];
      const listOfProducts = {};

      for (const product of dto.products) {
        const cartProductOrError = CartProduct.create({
          cartId: cartId,
          productId: new UniqueEntityId(product.productId),
          quantity: product.quantity,
          
        });

        if (cartProductOrError.isFailure) {
          return left(
            new ApplicationError.ValidationError(
              cartProductOrError.errorValue().message,
              cartProductOrError.errorValue().details,
            ),
          );
        }

        const productDetail = await productQuery.retrieveProductById(new UniqueEntityId(product.productId));
        const productDetailJSON = productDetail.toJSON();

        listOfProducts[productDetailJSON.sku] = {
          price: productDetailJSON.price,
          quantity: product.quantity,
        }

        cartProducts.push(cartProductOrError.getValue());
      };

      const skuOfGoogleHome = '120P90';
      const skuOfMacbookPro = '43N23P';
      const skuOfAlexaSpeaker = 'A304SD';
      const skuOfRaspberryPi = '234234';

      if (skuOfMacbookPro in listOfProducts) {
        if (skuOfRaspberryPi in listOfProducts) {
          const deltaOfRaspberryPAndMacbookPro = listOfProducts[skuOfRaspberryPi].quantity - listOfProducts[skuOfMacbookPro].quantity;
          listOfProducts[skuOfRaspberryPi].quantity = deltaOfRaspberryPAndMacbookPro >= 0 ? deltaOfRaspberryPAndMacbookPro : 0;

          totalPrice += listOfProducts[skuOfRaspberryPi].price * listOfProducts[skuOfRaspberryPi].quantity;
        }

        totalPrice += listOfProducts[skuOfMacbookPro].price * listOfProducts[skuOfMacbookPro].quantity;
      }

      if (skuOfGoogleHome in listOfProducts) {
        const qtyOfGoogleDividedByThree = Math.floor(listOfProducts[skuOfGoogleHome].quantity / 3);
        listOfProducts[skuOfGoogleHome].quantity = listOfProducts[skuOfGoogleHome].quantity - qtyOfGoogleDividedByThree;

        totalPrice += listOfProducts[skuOfGoogleHome].price * listOfProducts[skuOfGoogleHome].quantity;
      }

      if (skuOfAlexaSpeaker in listOfProducts) {
        const totalPriceOfAlexaSpeaker = listOfProducts[skuOfAlexaSpeaker].price * listOfProducts[skuOfAlexaSpeaker].quantity;

        totalPrice += listOfProducts[skuOfAlexaSpeaker].quantity >= 3 ? totalPriceOfAlexaSpeaker * 0.9 : totalPriceOfAlexaSpeaker;
      }

      const cartOrError = Cart.create({
        totalPrice,
        checkedOut: false,
        paid: false,
      }, cartId);

      if (cartOrError.isFailure) {
        return left(
          new ApplicationError.ValidationError(
            cartOrError.errorValue().message,
            cartOrError.errorValue().details,
          ),
        );
      }

      const cart = cartOrError.getValue();

      await Promise.all([
        cartRepository.create(cart),
        cartProductRepository.bulkCreate(cartProducts)
      ]);

      const response = {
        cartId: cartId.toString(),
        totalPrice
      };

      this.logger.trace({methodName, traceId}, 'END');

      return right(Result.ok<AddToCartUseCaseResponse>(response));
    } catch (e) {
      const err = e as Error;
      return left(new ApplicationError.UnexpectedError(e as Error));
    }
  }
}
