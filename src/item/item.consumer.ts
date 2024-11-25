import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class ItemConsumer {
  @EventPattern('item_created')
  handleItemCreado(@Payload() data: any) {
    console.log('Item created succesfully:', data);
    
  }

  @EventPattern('item_updated')
  handleItemActualizado(@Payload() data: any) {
    console.log('Item updated succesfully:', data);

  }
}
