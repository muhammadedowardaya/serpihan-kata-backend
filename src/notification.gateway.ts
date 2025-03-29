/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'https://your-nextjs-app.vercel.app',
    credentials: true,
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>();

  handleConnection(client: Socket) {
    console.log('✅ Socket connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    const userId = [...this.connectedUsers.entries()].find(
      ([, id]) => id === client.id,
    )?.[0];

    if (userId) {
      console.log(`❌ ${userId} disconnected`);
      this.connectedUsers.delete(userId);
    }

    console.log('Users online:', Array.from(this.connectedUsers.keys()));
  }

  @SubscribeMessage('registerUser')
  handleRegisterUser(client: Socket, userId: string) {
    if (this.connectedUsers.has(userId)) {
      console.log(`🔄 ${userId} reconnecting...`);
    }

    this.connectedUsers.set(userId, client.id);
    client.join(userId);

    console.log('Users online:', Array.from(this.connectedUsers.keys()));
    client.emit('userJoined', `User ${userId} joined the room`);
  }

  @SubscribeMessage('sendNotification')
  handleSendNotification(
    client: Socket,
    {
      targetUser,
      message,
      url,
    }: { targetUser: any; message: string; url: string },
  ) {
    console.info('sendNotification', targetUser, message, url);
    this.server.to(targetUser.id).emit('notification', {
      username: targetUser.username,
      body: message,
      image: targetUser.image,
      url: url,
    });
  }

  @SubscribeMessage('unreadCount')
  handleUnreadCount(
    client: Socket,
    { unreadCount, userId }: { unreadCount: number; userId: string },
  ) {
    console.info('unreadCount', unreadCount, userId);
    this.server.to(userId).emit('unreadCountNotification', unreadCount);
  }
}
