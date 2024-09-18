"use client";

import React from "react";

interface SystemStatusProps {
  data: {
    ASICModel: string;
    uptimeSeconds: number;
    temp: number;
    freeHeap: number;
    version: string;
  };
}

const SystemStatus: React.FC<SystemStatusProps> = ({ data }) => {
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="card bg-base-300 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">System Status</h2>
        <div>
        <p>ASIC Model: {data.ASICModel}</p>
        <p>Uptime: {formatUptime(data.uptimeSeconds)}</p>
        <p>Free Memory: {(data.freeHeap / 1024).toFixed(2)} KB</p>
        <p>Version: {data.version}</p>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
