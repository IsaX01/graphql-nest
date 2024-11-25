import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { ClientProxyFactory, Transport, ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ItemService implements OnModuleInit, OnModuleDestroy{
  private client: ClientProxy;

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://TU_USUARIO:TU_CONTRASEÑA@TU_HOST:5672'],
        queue: 'items_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.close(); 
    }
  }

  findAll(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  findOne(id: number): Promise<Item> {
    return this.itemRepository.findOneBy({ id });
  }

  async create(item: Partial<Item>): Promise<Item> {
    const newItem = this.itemRepository.create(item);
    const savedItem = await this.itemRepository.save(newItem);
    this.client.emit('item_created', savedItem);
    return savedItem;
  }

  async update(id: number, item: Partial<Item>): Promise<Item> {
    await this.itemRepository.update(id, item);
    const updatedItem = await this.findOne(id);
    this.client.emit('item_updated', updatedItem);
    return updatedItem;
  }

  async delete(id: number): Promise<void> {
    return this.itemRepository.delete(id).then(() => undefined);
  }

  @Cron('0 0 * * *') 
  async cleanOldItems() {
    const limitedDate = new Date();
    limitedDate.setDate(limitedDate.getDate() - 30);
    await this.itemRepository
      .createQueryBuilder()
      .delete()
      .where('createAt < :limitedData', { limitedDate })
      .execute();
    console.log('Old items deleted successfully');
  }
}
