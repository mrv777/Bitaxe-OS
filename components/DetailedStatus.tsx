import React from "react";

interface DetailedStatusProps {
  data: {
    coreVoltage: number;
    coreVoltageActual: number;
    bestDiff: string;
    bestSessionDiff: string;
    fanrpm: number;
    fanspeed: number;
    frequency: number;
    power: number;
    hashRate: number;
    voltage: number;
  };
}

const DetailedStatus: React.FC<DetailedStatusProps> = ({ data }) => {
  // Calculate efficiency (hashrate per watt)
  const efficiency = (data.power / data.hashRate) * 1000;

  return (
    <div className="card bg-base-300 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Detailed Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p>
              Best Difficulty: {data.bestSessionDiff} (
              <span className="tooltip cursor-help" data-tip="All Time">
                {data.bestDiff}
              </span>
              )
            </p>
            <p>
              Core Voltage: {(data.coreVoltageActual / 1000).toFixed(2)} V (
              <span
                className="tooltip cursor-help"
                data-tip="Requested voltage"
              >
                {(data.coreVoltage / 1000).toFixed(2)} V
              </span>
              )
            </p>
            <p>Frequency: {data.frequency} MHz</p>
          </div>
          <div>
            <p>
              Fan RPM: {data.fanrpm} ({data.fanspeed}%)
            </p>
            <p>Wattage: {data.power.toFixed(2)} W</p>
            <p
              className={`${
                data.voltage > 4940
                  ? "text-green-500"
                  : data.voltage > 4800
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              Voltage: {(data.voltage / 1000).toFixed(2)} V
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedStatus;
