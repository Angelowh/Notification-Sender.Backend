import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RMQ_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://jaragua-01.lmq.cloudamqp.com:5672'],
          queue: 'fila.notificacao.entrada.pedro-angelo',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}