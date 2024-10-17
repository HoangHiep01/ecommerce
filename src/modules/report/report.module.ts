import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { OrderModule } from '../order/order.module';
import { OrderItem } from '../order//entities/order-item.entity';
import { Order } from '../order//entities/order.entity';

@Module({
  imports: [OrderModule, TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [ReportController],
  providers: [ReportService, Logger],
  exports: [ReportService],
})
export class ReportModule {}
