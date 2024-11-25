import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

const logger = new Logger('Microservice');

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://isax01:isax@my-rabbitmq-0.my-rabbitmq-headless.default.svc.cluster.local:5672'],
        queue: 'items_queue',
        queueOptions: {
          durable: false,
          retryAttempts: 5,
          retryDelay: 3000,
        },
      },
    });

    app.startAllMicroservices().then(() => {
      logger.log('Microservices started successfully');
    }).catch((error) => {
      logger.error('Failed to start microservices:', error.message);
    });

    await app.listen(3000);
    logger.log('Application is listening on port 3000');
  } catch (error) {
    logger.error('Application failed to start:', error.message);
  }
}

bootstrap();
