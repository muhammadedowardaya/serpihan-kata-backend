import { PushController } from './push.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { PushService } from './push.service';

describe('PushController', () => {
  let controller: PushController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PushController],
      providers: [
        {
          provide: PushService,
          useValue: {
            addSubscirption: jest
              .fn()
              .mockResolvedValue({ message: 'subscribed successfully!' }),
            sendNotification: jest.fn().mockResolvedValue({
              message: 'send notification successfully!',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<PushController>(PushController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
