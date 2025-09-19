import NetInfo from '@react-native-community/netinfo';
import { NetworkStatus } from './httpConfig';
import { log, logError } from './environment';

class NetworkService {
  private networkStatus: NetworkStatus = {
    isConnected: true,
    connectionType: 'unknown',
    isInternetReachable: true,
  };

  private listeners: Array<(status: NetworkStatus) => void> = [];

  constructor() {
    this.initializeNetworkMonitoring();
  }

  private initializeNetworkMonitoring(): void {
    // Subscribe to network state changes
    NetInfo.addEventListener(state => {
      this.networkStatus = {
        isConnected: state.isConnected ?? false,
        connectionType: this.mapConnectionType(state.type),
        isInternetReachable: state.isInternetReachable ?? false,
      };

      log('Network status changed:', this.networkStatus);

      // Notify all listeners
      this.listeners.forEach(listener => {
        try {
          listener(this.networkStatus);
        } catch (error) {
          logError('Error in network status listener:', error);
        }
      });
    });
  }

  private mapConnectionType(type: string): NetworkStatus['connectionType'] {
    switch (type) {
      case 'wifi':
        return 'wifi';
      case 'cellular':
        return 'cellular';
      case 'ethernet':
        return 'ethernet';
      default:
        return 'unknown';
    }
  }

  // Get current network status
  getNetworkStatus(): NetworkStatus {
    return { ...this.networkStatus };
  }

  // Check if device is connected to internet
  isConnected(): boolean {
    return (
      this.networkStatus.isConnected && this.networkStatus.isInternetReachable
    );
  }

  // Check if device is connected to WiFi
  isWiFiConnected(): boolean {
    return (
      this.networkStatus.isConnected &&
      this.networkStatus.connectionType === 'wifi'
    );
  }

  // Check if device is connected to cellular
  isCellularConnected(): boolean {
    return (
      this.networkStatus.isConnected &&
      this.networkStatus.connectionType === 'cellular'
    );
  }

  // Subscribe to network status changes
  subscribe(listener: (status: NetworkStatus) => void): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Get detailed network information
  async getDetailedNetworkInfo(): Promise<any> {
    try {
      const state = await NetInfo.fetch();
      return {
        isConnected: state.isConnected,
        type: state.type,
        isInternetReachable: state.isInternetReachable,
        details: state.details,
      };
    } catch (error) {
      logError('Error getting detailed network info:', error);
      return null;
    }
  }

  // Check if we should retry requests based on network status
  shouldRetryRequest(): boolean {
    return this.isConnected();
  }

  // Get appropriate timeout based on connection type
  getTimeoutForConnection(): number {
    if (this.isWiFiConnected()) {
      return 10000; // 10 seconds for WiFi
    } else if (this.isCellularConnected()) {
      return 15000; // 15 seconds for cellular
    } else {
      return 20000; // 20 seconds for unknown/slow connections
    }
  }
}

export default new NetworkService();
