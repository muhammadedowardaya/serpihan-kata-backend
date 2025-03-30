import { Test, TestingModule } from '@nestjs/testing';
import { PushService } from './push.service';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';

describe('PushService', () => {
  let service: PushService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PushService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              const mockConfig = {
                EMAIL: 'mailto:test@example.com',
                VAPID_PUBLIC_KEY: 'mock-public-key',
                VAPID_PRIVATE_KEY: 'mock-private-key',
              };
              return mockConfig[key];
            }),
          },
        },
        {
          provide: RedisService,
          useValue: {
            setSubscription: jest.fn(),
            getSubscription: jest.fn().mockResolvedValue([]),
            delSubscription: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PushService>(PushService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
