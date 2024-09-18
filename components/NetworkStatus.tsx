import React from 'react';

interface NetworkStatusProps {
  data: {
    ssid: string;
    wifiStatus: string;
    hostname: string;
  };
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ data }) => {
  return (
    <div className="card bg-base-300 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Network Status</h2>
        <p>WiFi Status: {data.wifiStatus}</p>
        <p>SSID: {data.ssid}</p>
        <p>Hostname: {data.hostname}</p>
      </div>
    </div>
  );
};

export default NetworkStatus;