import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';
import * as webPush from 'web-push';

@Injectable()
export class PushService {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    webPush.setVapidDetails(
      this.configService.get('EMAIL') as string,
      this.configService.get('VAPID_PUBLIC_KEY') as string,
      this.configService.get('VAPID_PRIVATE_KEY') as string,
    );
  }

  async addSubscription(subscription: webPush.PushSubscription) {
    await this.redisService.setSubscription(subscription);
    return { message: 'Subscribed successfully!' };
  }

  async sendNotification({
    username,
    body,
  }: {
    username: string;
    body: string;
  }) {
    const subscriptions = await this.redisService.getSubscription();

    const payload = JSON.stringify({
      username: username,
      body: body,
    });

    await Promise.all(
      subscriptions.map(async (subscription) => {
        try {
          await webPush.sendNotification(subscription, payload);
        } catch (error) {
          console.error('Gagal mengirim notifikasi:', error);

          // Hapus subscription jika status 410 (Gone) atau 404 (Not Found)
          if (error.statusCode === 410 || error.statusCode === 404) {
            console.log(
              'Menghapus subscription yang tidak valid:',
              subscription.endpoint,
            );
            await this.redisService.delSubscription(subscription.endpoint);
          }
        }
      }),
    );

    return { message: 'Notifikasi dikirim!' };
  }
}
