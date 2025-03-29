import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('subscription')
  getSubscription() {
    return this.redisService.getSubscription();
  }

  @Get('say-hello/:name')
  getSayHello(@Param('name') name: string) {
    if (!name) return `Hello gaes!`;
    return `Hello ${name} ✋😁`;
  }

  @Get('say-hello')
  getSayHello2(@Query('name') name: string) {
    if (!name) return `Hello good people!`;
    return `Hello, nice to meet you ${name}`;
  }
}
