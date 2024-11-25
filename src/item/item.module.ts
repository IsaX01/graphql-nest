import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { ItemService } from './item.service';
import { ItemResolver } from './item.resolver';
import { ItemConsumer } from './item.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  providers: [ItemService, ItemResolver, ItemConsumer],
})
export class ItemModule {}
