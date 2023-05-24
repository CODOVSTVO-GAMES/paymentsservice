import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/models/Product';
import { Transaction } from 'src/models/Transaction';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'psqldb',
      port: 5432,
      username: 'keshox',
      password: 'example',
      database: 'paymentsdb',
      entities: [Product, Transaction],
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
})
export class PostgresModule { }
