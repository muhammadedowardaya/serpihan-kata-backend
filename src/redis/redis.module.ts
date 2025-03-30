import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: () => {
        return new Redis(
          'rediss://default:Ab0PAAIjcDFhNWZlMWYzYWJiMjk0MjYzYjYzY2ZlOTExY2RjMDcyMHAxMA@fair-mullet-48399.upstash.io:6379',
        );
      },
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
  controllers: [RedisController],
})
export class RedisModule {}
