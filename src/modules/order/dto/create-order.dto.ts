import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { OrderState } from '../../../constants/order-state';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  cartId;

  @IsEnum(OrderState)
  orderState;
}
