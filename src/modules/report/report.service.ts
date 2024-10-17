import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from '../order//entities/order-item.entity';
import { Order } from '../order//entities/order.entity';
import { genenateReturnObject } from '../../constants/return-object';
import { OrderState } from '../../constants/order-state';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private logger: Logger,
  ) {}

  SERVICE: string = ReportService.name;

  async getTopTen(): Promise<object> {
    try {
      const orderIdShipped = await this.orderRepository
        .createQueryBuilder('order')
        .select('order.id', 'id')
        .where('order.state = :state', { state: OrderState.SHIPPED })
        .getRawMany();
      const ids = [];
      for (const id of orderIdShipped) {
        ids.push(id.id);
      }
      const top10BestSaled = await this.orderItemRepository
        .createQueryBuilder('orderItem')
        .select('orderItem.inventory')
        .addSelect('SUM(orderItem.quantity)', 'totalSaled')
        // .leftJoinAndSelect('orderItem.inventory', 'inventory')
        .where('orderItem.order IN (:...ids)', { ids: ids })
        .groupBy('orderItem.inventory')
        .orderBy('SUM(orderItem.quantity)', 'DESC')
        .limit(10)
        .printSql()
        .getRawMany();

      this.logger.log('Report top 10 best saled', this.SERVICE);
      return genenateReturnObject(200, top10BestSaled);
    } catch (error) {
      this.logger.error(
        'Unable to make report top 10 best saled',
        error.stack,
        this.SERVICE,
      );
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }
}
