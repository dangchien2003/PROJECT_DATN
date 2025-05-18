// services/WebSocketService.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketConfig {
  constructor() {
    this.client = null; // lưu trữ connector
    this.subscriptions = new Map(); // lưu trữ sự kiện
    this.queueSubscribe = [];
  }

  connect = (onConnectCallback) => {
    if (this.client) return;

    const socket = new SockJS('https://localhost:8083/ws');
    this.client = new Client({
      webSocketFactory: () => socket,
      debug: () => {}, // tắt log
      reconnectDelay: 5000,
      connectHeaders: {
        'user-id': '641a00fd-9936-4a95-aa0c-d2fbc0fca9a3'
      },
      onConnect: () => {
        this.queueSubscribe.forEach(({ topic, callback }) => {
          this.subscribe(topic, callback);
        });
        this.queueSubscribe = [];
        if (onConnectCallback) onConnectCallback();
      },
    });

    this.client.activate(); // kết nối
  };

  subscribe = (topic, callback) => {
    if (!this.client || !this.client.connected) {
      this.queueSubscribe.push({ topic, callback });
      return;
    }

    if (!this.subscriptions.has(topic)) {
      const sub = this.client.subscribe(topic, (msg) => {
        const body = JSON.parse(msg.body);
        callback(body);
      });
      this.subscriptions.set(topic, sub);
    }
  };

  send = (destination, body) => {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination,
        body: JSON.stringify(body),
        headers: {
          'user-id': '641a00fd-9936-4a95-aa0c-d2fbc0fca9a3',
        },
      });
    }
  };

  disconnect = () => {
    this.client?.deactivate();
    this.subscriptions.clear();
    this.client = null;
  };
}

const WebSocket = new WebSocketConfig();
export default WebSocket; 
