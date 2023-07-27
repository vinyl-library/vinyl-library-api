import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toEqual({ message: 'Hello World!' });
    });
  });

  describe('getProtected', () => {
    it('should return "Authenticated!"', () => {
      expect(appController.getProtected()).toEqual({
        message: 'Authenticated!',
      });
    });
  });
});
