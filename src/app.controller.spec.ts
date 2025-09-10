import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificacaoDto } from './notificacao/dto/notificacao.dto';
import { ClientProxy } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';
import { of } from 'rxjs';

describe('AppController', () => {
  let appController: AppController;
  let clientProxy: ClientProxy;
  
  const appServiceMock = {};
  const clientProxyMock = {
    emit: jest.fn(() => of(null)), 
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: appServiceMock },
        {
          provide: 'RMQ_CLIENT', 
          useValue: clientProxyMock 
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    clientProxy = module.get<ClientProxy>('RMQ_CLIENT');
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('notificar', () => {
    it('deve chamar client.emit com os argumentos corretos e retornar a resposta esperada', async () => {
      const payload: NotificacaoDto = {
        mensagemId: 'abc-123',
        conteudoMensagem: 'Teste de notificação.',
      };
      
      const expectedResponse = {
        statusCode: HttpStatus.ACCEPTED,
        message: 'Mensagem recebida e encaminhada para processamento.',
        mensagemId: payload.mensagemId,
      };

      const result = await appController.notificar(payload);
      
      // O método 'emit' do ClientProxy deve ter sido chamado uma vez.
      expect(clientProxy.emit).toHaveBeenCalledTimes(1);

      // O método 'emit' deve ter sido chamado com os argumentos exatos.
      expect(clientProxy.emit).toHaveBeenCalledWith(
        'processar_notificacao',
        payload
      );
      
      expect(result).toEqual(expectedResponse);
    });
  });
});