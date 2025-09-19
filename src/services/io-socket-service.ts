// services/io-socket-service.ts
import { io, Socket } from 'socket.io-client';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SocketConfig {
  url: string;
  token?: string;
  userId?: string;
  reconnectAttempts?: number;
  timeout?: number;
}

export interface SocketEventCallbacks {
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onError?: (error: Error) => void;
  onReconnect?: (attemptNumber: number) => void;
  onReconnectError?: (error: Error) => void;
  onMessage?: (data: any) => void;
  onNotification?: (data: any) => void;
}

class SocketIOService {
  private socket: Socket | null = null;
  private config: SocketConfig | null = null;
  private callbacks: SocketEventCallbacks = {};
  private isConnecting = false;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private appStateSubscription: any = null;

  /**
   * Initialize socket connection
   */
  async connect(config: SocketConfig, callbacks: SocketEventCallbacks = {}) {
    if (this.isConnecting || this.socket?.connected) {
      console.log('Socket already connected or connecting');
      return;
    }

    this.config = config;
    this.callbacks = callbacks;
    this.isConnecting = true;

    try {
      // Get stored auth token if not provided
      const token = config.token || (await AsyncStorage.getItem('auth_token'));

      this.socket = io(config.url, {
        // Transport options for React Native
        transports: ['websocket', 'polling'],

        // Authentication
        auth: {
          token,
          userId: config.userId,
        },
        // extraHeaders: {
        //   Authorization: 'Bearer abc123',
        //   'x-user-id': '42',
        // },

        // Connection options
        timeout: config.timeout || 20000,
        reconnection: true,
        reconnectionAttempts: config.reconnectAttempts || 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        // ...({ maxHttpBufferSize: 1e6 } as any),

        // Force new connection
        forceNew: false,

        // Auto connect
        autoConnect: true,

        // Additional headers for React Native
        extraHeaders: {
          'User-Agent': 'ReactNative',
        },
      });

      this.setupEventListeners();
      this.setupAppStateHandling();
    } catch (error) {
      console.error('Socket connection failed:', error);
      this.isConnecting = false;
      this.callbacks.onError?.(error as Error);
    }
  }

  /**
   * Setup socket event listeners
   */
  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.isConnecting = false;
      this.clearReconnectTimer();
      this.callbacks.onConnect?.();
    });

    this.socket.on('disconnect', reason => {
      console.log('Socket disconnected:', reason);
      this.callbacks.onDisconnect?.(reason);

      // Handle different disconnect reasons
      if (reason === 'io server disconnect') {
        // Server disconnected, manual reconnection needed
        this.scheduleReconnect();
      }
    });

    this.socket.on('connect_error', error => {
      console.error('Socket connection error:', error);
      this.isConnecting = false;
      this.callbacks.onError?.(error);
    });

    this.socket.on('reconnect', attemptNumber => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      this.callbacks.onReconnect?.(attemptNumber);
    });

    this.socket.on('reconnect_error', error => {
      console.error('Socket reconnection error:', error);
      this.callbacks.onReconnectError?.(error);
    });

    // Custom app events
    this.socket.on('message', data => {
      this.callbacks.onMessage?.(data);
    });

    this.socket.on('notification', data => {
      this.callbacks.onNotification?.(data);
    });

    // Server-side authentication error
    this.socket.on('auth_error', async error => {
      console.error('Authentication error:', error);
      await this.refreshTokenAndReconnect();
    });
  }

  /**
   * Handle app state changes (background/foreground)
   */
  private setupAppStateHandling() {
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange,
    );
  }

  private handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      // App came to foreground - reconnect if needed
      if (!this.socket?.connected && !this.isConnecting) {
        this.reconnect();
      }
    } else if (nextAppState === 'background') {
      // App went to background - optionally disconnect to save battery
      // this.disconnect();
    }
  };

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect() {
    if (this.reconnectTimer) return;

    this.reconnectTimer = setTimeout(() => {
      this.reconnect();
    }, 3000);
  }

  /**
   * Clear reconnection timer
   */
  private clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * Refresh auth token and reconnect
   */
  private async refreshTokenAndReconnect() {
    try {
      // Implement your token refresh logic here
      const newToken = await this.refreshAuthToken();

      if (newToken && this.config) {
        this.config.token = newToken;
        this.disconnect();
        await this.connect(this.config, this.callbacks);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
  }

  /**
   * Implement your token refresh logic
   */
  private async refreshAuthToken(): Promise<string | null> {
    // Replace with your actual token refresh implementation
    try {
      // Example API call to refresh token
      // const response = await fetch('/api/auth/refresh');
      // const data = await response.json();
      // await AsyncStorage.setItem('auth_token', data.token);
      // return data.token;

      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  }

  /**
   * Manually reconnect socket
   */
  async reconnect() {
    if (this.config) {
      await this.connect(this.config, this.callbacks);
    }
  }

  /**
   * Emit event to server
   */
  emit(event: string, data?: any): boolean {
    if (!this.socket?.connected) {
      console.warn('Socket not connected. Cannot emit event:', event);
      return false;
    }

    this.socket.emit(event, data);
    return true;
  }

  /**
   * Emit event with acknowledgment
   */
  emitWithAck(event: string, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit(event, data, (response: any) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Join a room
   */
  joinRoom(roomId: string) {
    this.emit('join_room', { roomId });
  }

  /**
   * Leave a room
   */
  leaveRoom(roomId: string) {
    this.emit('leave_room', { roomId });
  }

  /**
   * Send private message
   */
  sendMessage(to: string, message: string, type: string = 'text') {
    this.emit('private_message', {
      to,
      message,
      type,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Listen to specific event
   */
  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback?: (data: any) => void) {
    this.socket?.off(event, callback);
  }

  /**
   * Get connection status
   */
  get isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Get socket ID
   */
  get socketId(): string | undefined {
    return this.socket?.id;
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    this.clearReconnectTimer();

    if (this.appStateSubscription) {
      this.appStateSubscription?.remove();
      this.appStateSubscription = null;
    }

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.isConnecting = false;
    this.config = null;
    this.callbacks = {};
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.disconnect();
  }
}

const socketService = new SocketIOService();

export default socketService;
