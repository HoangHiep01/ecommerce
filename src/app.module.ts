import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';
import { typeOrmAsyncConfig } from './db/data.source';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { CustomersModule } from './modules/customers/customers.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { ReportModule } from './modules/report/report.module';
import { thottleAsyncConfig } from './config/rate-limit.config';
import configuration from './config/configuration';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ThrottlerModule.forRootAsync(thottleAsyncConfig),
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local'],
      ignoreEnvFile: false,
      isGlobal: true,
      load: [configuration],
    }),
    UsersModule,
    AuthModule,
    ProductModule,
    CustomersModule,
    InventoryModule,
    CartModule,
    OrderModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  constructor(
    private dataSource: DataSource,
    private readonly logger: Logger,
  ) {
    // console.log('db name: ', dataSource.driver.database);
    logger.log(`Connect to database: ${dataSource.driver.database}`);
  }
}
