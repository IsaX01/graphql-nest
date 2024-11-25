import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://isax01:isax@rabbitmq:5672'],
      queue: 'items_queue',
      queueOptions: {
        durable: false,
      },
      retryAttempts: 5,
      retryDelay: 3000,
    },
  });
  
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
