import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ItemModel {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  createAt: Date;

  @Field()
  updateAt: Date;

  @Field()
  deleteAt: Date;
}
