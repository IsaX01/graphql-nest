import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ItemService } from './item.service';
import { ItemModel } from './model/item.model';

@Resolver(() => ItemModel)
export class ItemResolver {
  constructor(private readonly itemService: ItemService) {}

  @Query(() => [ItemModel])
  items() {
    return this.itemService.findAll();
  }

  @Query(() => ItemModel)
  item(@Args('id', { type: () => Int }) id: number) {
    return this.itemService.findOne(id);
  }

  @Mutation(() => ItemModel)
  async createItem(
    @Args('name') name: string,
    @Args('description') description: string,
  ) {
    return this.itemService.create({ name, description });
  }

  @Mutation(() => ItemModel)
  async updateItem(
    @Args('id', { type: () => Int }) id: number,
    @Args('name', { nullable: true }) name: string,
    @Args('description', { nullable: true }) description: string,
  ) {
    return this.itemService.update(id, { name, description });
  }

  @Mutation(() => Boolean)
  async deleteItem(@Args('id', { type: () => Int }) id: number) {
    await this.itemService.delete(id);
    return true;
  }
}