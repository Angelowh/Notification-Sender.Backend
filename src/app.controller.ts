import { Controller, Post, Body, Get, HttpStatus, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { NotificacaoDto } from './notificacao/dto/notificacao.dto';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('RMQ_CLIENT') private readonly client: ClientProxy,
  ) {}

  @Post('/api/notificar')
  async notificar(@Body() payload: NotificacaoDto): Promise<any> {
    // envia notificacao para a fila
    this.client.emit('processar_notificacao', payload);
    
    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Mensagem recebida e encaminhada para processamento.',
      mensagemId: payload.mensagemId,
    };
  }
}