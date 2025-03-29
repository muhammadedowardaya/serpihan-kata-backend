import { Body, Controller, Post } from '@nestjs/common';
import { PushService } from './push.service';
import { PushSubscription } from 'web-push';

interface NotificationPayload {
  username: string;
  body: string;
}

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('subscribe')
  subscribe(@Body() subscription: PushSubscription) {
    return this.pushService.addSubscription(subscription);
  }

  @Post('send-notification')
  sendNotification(@Body() { username, body }: NotificationPayload) {
    return this.pushService.sendNotification({ username, body });
  }
}
