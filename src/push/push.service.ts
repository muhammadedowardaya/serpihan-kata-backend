import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import * as webPush from 'web-push';

@Injectable()
export class PushService {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    webPush.setVapidDetails(
      'mailto:muhammadedowardaya@gmail.com',
      'BCV8zg3L26yg1Rk02xxuj7ndww2lpLlt7mM-mhhBsUv41ySNTO2XLWQYSrrDMssYJze4x3JE-yqYCQyY3U13sT4',
      'VYkgHnM3iP3ECBSx03tBTg1Oja6kx-vGgokkU8zeD4o',
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
