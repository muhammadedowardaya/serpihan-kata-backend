import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { PushSubscription } from 'web-push';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async setSubscription(value: PushSubscription) {
    const subscriptions = await this.getSubscription();

    // Cari subscription lama dengan endpoint yang sama
    const existingSubscription = subscriptions.find(
      (sub) => sub.endpoint === value.endpoint,
    );

    // Jika sudah ada, hapus subscription lama sebelum menyimpan yang baru
    if (existingSubscription) {
      await this.delSubscription(value.endpoint);
    }

    // Simpan subscription baru
    await this.redisClient.sadd('subscription', JSON.stringify(value));
    console.log('Subscription disimpan:', value);
  }

  async getSubscription(): Promise<PushSubscription[]> {
    const subscriptions = await this.redisClient.smembers('subscription');
    return subscriptions.map((subscription) => JSON.parse(subscription));
  }

  async delSubscription(endpoint: string) {
    const subscriptions = await this.getSubscription();

    // Filter untuk menghapus hanya subscription yang tidak valid
    const updatedSubscriptions = subscriptions.filter(
      (sub) => sub.endpoint !== endpoint,
    );

    // Hapus data lama dari Redis
    await this.redisClient.del('subscription');

    // Simpan ulang hanya subscription yang masih valid
    for (const sub of updatedSubscriptions) {
      await this.redisClient.sadd('subscription', JSON.stringify(sub));
    }

    console.log('Subscription dihapus:', endpoint);
  }
}
