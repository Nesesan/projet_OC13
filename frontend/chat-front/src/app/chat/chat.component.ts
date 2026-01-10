import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {WebsocketService} from "../services/websocket.service";

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

  colors: string[] = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
  ];

  ngOnInit(): void {}

  constructor(private wsService: WebsocketService) {}

  connect(): void {
    if (!this.username.trim()) return;

    this.wsService.connect(this.username, (msg) => {
      this.connected = true;
      this.messages.push(msg);
      setTimeout(() => this.scrollToBottom(), 0);
    });
  }


  sendMessage(): void {
    this.wsService.sendMessage(this.username, this.messageContent);
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
