import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from '../order//entities/order-item.entity';
import { Order } from '../order//entities/order.entity';
import { InventoryService } from '../inventory/inventory.service';
import { genenateReturnObject } from '../../constants/return-object';
import { OrderState } from '../../constants/order-state';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private inventoryService: InventoryService,
    private logger: Logger,
  ) {}

  SERVICE: string = ReportService.name;

  async getTopTen(): Promise<object> {
    try {
      const ids = await this.getOrderIdShipped();
      if (!Array.isArray(ids)) {
        return ids;
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

  async getDayRevenue(
    day: string,
    month: string,
    year: string,
  ): Promise<object> {
    try {
      const currentDate = new Date();
      if (+year < 1900 || +year > currentDate.getFullYear()) {
        this.logger.log('Year invalid', this.SERVICE);
        return genenateReturnObject(400, {}, 'Year invalid');
      }
      if (+month < 1 || +month > 12) {
        this.logger.log('Month invalid', this.SERVICE);
        return genenateReturnObject(400, {}, 'Month invalid');
      }

      // Not implement check day

      const dayRevenue = await this.getItemByDateLike(
        `${year}_${month}_${day}%`,
      );

      if (typeof dayRevenue !== 'number') {
        return dayRevenue;
      }

      return genenateReturnObject(200, dayRevenue);
    } catch (error) {
      this.logger.error(
        'Unable to make report year revenue',
        error.stack,
        this.SERVICE,
      );
    }
  }

  async getMonthRevenue(month: string, year: string): Promise<object> {
    try {
      const currentDate = new Date();
      if (+year < 1900 || +year > currentDate.getFullYear()) {
        this.logger.log('Year invalid', this.SERVICE);
        return genenateReturnObject(400, {}, 'Year invalid');
      }
      if (+month < 1 || +month > 12) {
        this.logger.log('Month invalid', this.SERVICE);
        return genenateReturnObject(400, {}, 'Month invalid');
      }

      const monthRevenue = await this.getItemByDateLike(`${year}_${month}%`);

      if (typeof monthRevenue !== 'number') {
        return monthRevenue;
      }

      return genenateReturnObject(200, monthRevenue);
    } catch (error) {
      this.logger.error(
        'Unable to make report year revenue',
        error.stack,
        this.SERVICE,
      );
    }
  }

  async getYearRevenue(year: string): Promise<object> {
    try {
      const currentDate = new Date();
      if (+year < 1900 || +year > currentDate.getFullYear()) {
        this.logger.log('Year invalid', this.SERVICE);
        return genenateReturnObject(400, {}, 'Year invalid');
      }

      const yearRevenue = await this.getItemByDateLike(`${year}%`);

      if (typeof yearRevenue !== 'number') {
        return yearRevenue;
      }

      return genenateReturnObject(200, yearRevenue);
    } catch (error) {
      this.logger.error(
        'Unable to make report year revenue',
        error.stack,
        this.SERVICE,
      );
    }
  }

  // support func

  async getItemByDateLike(datePattern: string): Promise<number | object> {
    const ids = await this.getOrderIdShipped();
    if (!Array.isArray(ids)) {
      return ids;
    }

    const saledOnDatePattern = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .select('orderItem.inventory')
      .addSelect('SUM(orderItem.quantity)', 'totalSaled')
      .where('"orderItem"."createdAt"::text LIKE :year', { year: datePattern })
      .andWhere('orderItem.order IN (:...ids)', { ids: ids })
      .groupBy('orderItem.inventory')
      .orderBy('SUM(orderItem.quantity)', 'DESC')
      .printSql()
      .getRawMany();

    let revenue = 0;
    for (const item of saledOnDatePattern) {
      const result = await this.inventoryService.findOne(item.inventoryId);
      if (result['statusCode'] != 200) {
        return result;
      }

      const price = parseFloat(
        result['data'].productId.price.slice(0, -2).replaceAll('.', ''),
      );
      const amount = parseInt(item.totalSaled);
      revenue += price * amount;
    }
    return revenue;
  }

  async getOrderIdShipped(): Promise<Array<number> | object> {
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
      return ids;
    } catch (error) {
      this.logger.error(
        'Unable to fetch list id order shipped',
        error.stack,
        this.SERVICE,
      );
      return genenateReturnObject(error.statusCode, {}, error.message);
    }
  }
}
