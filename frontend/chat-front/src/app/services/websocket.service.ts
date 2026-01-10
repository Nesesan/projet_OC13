import { Injectable } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private client!: Client;

  connect(username: string, onMessage: (msg: any) => void): void {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/wss'),
      reconnectDelay: 5000
    });

    this.client.onConnect = () => {
      // S'abonner au bon topic
      this.client.subscribe('/topic/public', (message: IMessage) => {
        onMessage(JSON.parse(message.body));
      });

      // Envoyer le message JOIN
      this.client.publish({
        destination: '/app/chat.addUser',
        body: JSON.stringify({ sender: username, type: 'JOIN' })
      });
    };

    this.client.activate();
  }

  sendMessage(username: string, content: string) {
    if (!this.client || !this.client.connected) return;

    this.client.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({ sender: username, content, type: 'CHAT' })
    });
  }
}
