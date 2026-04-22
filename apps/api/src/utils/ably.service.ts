import { Injectable } from '@nestjs/common';
import * as Ably from 'ably';

@Injectable()
export class AblyService {
  private client: Ably.Realtime;

  constructor() {
    const apiKey = process.env.ABLY_API_KEY;
    if (apiKey && apiKey !== 'your_api_key_here') {
      this.client = new Ably.Realtime(apiKey);
    }
  }

  /**
   * Generates a token request for client-side authentication.
   * This is the secure way to allow clients to connect to Ably.
   */
  async createTokenRequest(clientId: string) {
    if (!this.client) {
      throw new Error('Ably client not initialized. Check ABLY_API_KEY.');
    }
    return this.client.auth.createTokenRequest({ clientId });
  }

  /**
   * Publishes a message to a specific room channel.
   * Channel format is usually 'room:roomId'
   */
  async publishToRoom(roomId: string, event: string, data: any) {
    if (!this.client) return;
    const channel = this.client.channels.get(`room:${roomId}`);
    await channel.publish(event, data);
  }
}
