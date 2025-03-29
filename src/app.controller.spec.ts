import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: RedisService,
          useValue: { getSubscription: jest.fn(() => 'Mocked Subscription') }, // Mock method
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Cihuy!"', () => {
      expect(appController.getHello()).toBe('Cihuy!');
    });
  });
});
