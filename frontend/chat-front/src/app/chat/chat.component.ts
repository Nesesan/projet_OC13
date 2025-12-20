import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // pour *ngIf et *ngFor
import { FormsModule } from '@angular/forms';    // pour [(ngModel)]
import * as SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

interface ChatMessage {
  sender: string;
  content?: string;
  type: 'JOIN' | 'LEAVE' | 'CHAT';
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  styleUrls: ['./chat.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ChatComponent implements OnInit {

  username: string = '';
  messageContent: string = '';
  messages: ChatMessage[] = [];
  connected = false;
  stompClient: Client | null = null;

  colors: string[] = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
  ];

  ngOnInit(): void {}

  connect(): void {
    if (!this.username.trim()) return;

    const socket = new SockJS('http://localhost:8080/wss');
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: () => {}
    });

    this.stompClient.onConnect = () => {
      this.connected = true;

      this.stompClient?.subscribe('/chat/public', (msg: IMessage) => {
        const payload = JSON.parse(msg.body);
        this.messages.push(payload);
        setTimeout(() => this.scrollToBottom(), 0);
      });

      this.sendMessage({ sender: this.username, type: 'JOIN' });
    };

    this.stompClient.onStompError = (frame: any) => {
      console.error('Broker error:', frame);
      alert('Impossible de se connecter au serveur WebSocket.');
    };

    this.stompClient.activate();
  }

  sendMessage(message?: Partial<ChatMessage>): void {
    if (!this.stompClient) return;

    const chatMessage: Partial<ChatMessage> = message || {
      sender: this.username,
      content: this.messageContent,
      type: 'CHAT'
    };

    this.stompClient.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(chatMessage)
    });

    this.messageContent = '';
  }

  getAvatarColor(sender: string): string {
    let hash = 0;
    for (let i = 0; i < sender.length; i++) {
      hash = 31 * hash + sender.charCodeAt(i);
    }
    return this.colors[Math.abs(hash % this.colors.length)];
  }

  private scrollToBottom(): void {
    const el = document.getElementById('messageArea');
    if (el) el.scrollTop = el.scrollHeight;
  }
}
