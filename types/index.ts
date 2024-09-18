export interface DashboardData {
  ASICModel: string;
  asicCount: number;
  autofanspeed: number;
  bestDiff: string;
  bestSessionDiff: string;
  boardVersion: string;
  coreVoltage: number;
  coreVoltageActual: number;
  current: number;
  fanrpm: number;
  fanspeed: number;
  flipscreen: number;
  freeHeap: number;
  frequency: number;
  hashRate: number;
  hostname: string;
  invertfanpolarity: number;
  invertscreen: number;
  overheat_mode: number;
  power: number;
  runningPartition: string;
  sharesAccepted: number;
  sharesRejected: number;
  smallCoreCount: number;
  ssid: string;
  stratumPort: number;
  stratumURL: string;
  stratumUser: string;
  temp: number;
  uptimeSeconds: number;
  version: string;
  voltage: number;
  vrTemp: number;
  wifiStatus: string;
}

export interface NetworkStatus {
  wifiStatus: string;
  ssid: string;
  hostname: string;
}