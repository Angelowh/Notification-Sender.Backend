import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://jaragua-01.lmq.cloudamqp.com:5672'],
        queue: 'fila.notificacao.entrada.pedro-angelo',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  // Habilita a validação globalmente
  app.useGlobalPipes(new ValidationPipe());

  await app.listen();
  console.log('Microserviço RMQ está rodando...');
}
bootstrap();
