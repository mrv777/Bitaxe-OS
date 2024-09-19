import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Add this utility function at the top of the file
const formatDifficulty = (value: number): string => {
  const suffixes = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
  let suffixIndex = 0;

  while (value >= 1000 && suffixIndex < suffixes.length - 1) {
    value /= 1000;
    suffixIndex++;
  }

  const formattedValue = parseFloat(value.toFixed(1)).toString();
  return formattedValue + ' ' + suffixes[suffixIndex];
};

interface MinerStatusProps {
  data: {
    hashRate: number;
    temp: number;
    sharesAccepted: number;
    sharesRejected: number;
    frequency: number;
    smallCoreCount: number;
    asicCount: number;
    power: number;
    hostname: string;
    stratumUser: string;
    bestDiff: number | string;
    bestSessionDiff: number | string;
  };
  hideTemp?: boolean;
  showDiff?: boolean;
}

interface TimeSeriesData {
  timestamp: number;
  hashRate: number;
  avgHashRate: number | null;
  temp: number;
}

const MinerStatus: React.FC<MinerStatusProps> = ({
  data,
  hideTemp = false,
  showDiff = false,
}) => {
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [expectedHashRate, setExpectedHashRate] = useState<number>(0);

  useEffect(() => {
    // Load data from local storage on component mount
    const storedData = localStorage.getItem(
      `minerStatusData-${data.hostname}-${data.stratumUser}`
    );
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setTimeSeriesData(parsedData);
    }

    // Calculate expected hash rate
    const calculatedExpectedHashRate = Math.floor(
      data.frequency * ((data.smallCoreCount * data.asicCount) / 1000)
    );
    setExpectedHashRate(calculatedExpectedHashRate);
  }, [data]);

  useEffect(() => {
    const now = Date.now();
    const newDataPoint = {
      timestamp: now,
      hashRate: data.hashRate,
      avgHashRate: calculateAvgHashRate(timeSeriesData, data.hashRate),
      temp: data.temp,
    };

    setTimeSeriesData((prevData) => {
      const updatedData = [...prevData, newDataPoint];
      // Keep only data from the last 24 hours
      const filteredData = updatedData.filter(
        (point) => now - point.timestamp <= 24 * 60 * 60 * 1000
      );

      // Save to local storage
      localStorage.setItem(
        `minerStatusData-${data.hostname}-${data.stratumUser}`,
        JSON.stringify(
          filteredData.map((point) => ({
            timestamp: point.timestamp,
            hashRate: point.hashRate,
            avgHashRate: point.avgHashRate,
            temp: point.temp,
          }))
        )
      );

      return filteredData;
    });
  }, [data]);

  const calculateAvgHashRate = (
    data: TimeSeriesData[],
    currentHashRate: number
  ): number => {
    const lastFiftyPoints = [...data.slice(-49), { hashRate: currentHashRate }];
    const sum = lastFiftyPoints.reduce((acc, point) => acc + point.hashRate, 0);
    return sum / lastFiftyPoints.length;
  };

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTooltip = (value: number, name: string) => {
    if (
      name === "Hashrate" ||
      name === "Avg Hashrate" ||
      name === "Expected Hashrate"
    ) {
      return formatHashrate(value);
    }
    return value;
  };

  const formatHashrate = (hashrate: number) => {
    return `${(hashrate / 1000).toFixed(2)} Th/s`;
  };

  const getYAxisLabel = () => {
    return "Hashrate Th/s";
  };

  return (
    <div className="card bg-base-300 shadow-xl">
      <div className="card-body">
        <div className="stats stats-vertical lg:stats-horizontal shadow">
        {showDiff ? (
          <div className="stat">
            <div className="stat-title">Best Difficulty</div>
            <div className="stat-value">
              {typeof data.bestDiff === 'number' ? formatDifficulty(data.bestDiff) : data.bestDiff}
            </div>
            <div className="stat-desc">
              This session: {typeof data.bestSessionDiff === 'number' ? formatDifficulty(data.bestSessionDiff) : data.bestSessionDiff}
            </div>
          </div>
        ) : (
          <div className="stat">
            <div className="stat-title">Hashrate</div>
            <div className="stat-value">{formatHashrate(data.hashRate)}</div>
            <div className="stat-desc">
              {((data.power / data.hashRate) * 1000).toFixed(2)} J/Th
            </div>
          </div>
        )}
          <div className="stat">
            <div className="stat-title">Avg Hashrate</div>
            <div className="stat-value">
              {formatHashrate(
                timeSeriesData[timeSeriesData.length - 1]?.avgHashRate || 0
              )}
            </div>
            <div className="stat-desc">
              {(
                (data.power /
                  timeSeriesData[timeSeriesData.length - 1]?.avgHashRate) *
                1000
              ).toFixed(2)}{" "}
              J/Th
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Accepted Shares</div>
            <div className="stat-value">
              {(
                (data.sharesAccepted /
                  (data.sharesAccepted + data.sharesRejected)) *
                100
              ).toFixed(2)}
              %
            </div>
            <div className="stat-desc">
              {data.sharesAccepted} /{" "}
              {data.sharesAccepted + data.sharesRejected}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Temperature</div>
            <div
              className={`stat-value ${
                data.temp > 60 ? "text-red-500" : "text-green-500"
              }`}
            >
              {data.temp}°C
            </div>
            <div className="stat-desc">
              {data.temp > 60 ? "Warning: Overheating" : "Healthy"}
            </div>
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeriesData}>
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatXAxis}
                interval="preserveStart"
              />
              <YAxis
                domain={["auto", "auto"]}
                label={{
                  value: getYAxisLabel(),
                  angle: -90,
                  position: "insideLeft",
                  dy: 50,
                }}
                tickFormatter={(value) => (value / 1000).toFixed(2)}
              />
              <Tooltip
                labelFormatter={(label) => new Date(label).toLocaleString()}
                formatter={formatTooltip}
                labelStyle={{ fontWeight: "bold" }}
                itemStyle={{ padding: "2px 0" }}
              />
              <Line
                type="monotone"
                dataKey="hashRate"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
                name="Hashrate"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="avgHashRate"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={false}
                name="Avg Hashrate"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey={() => expectedHashRate}
                stroke="#ff7300"
                strokeDasharray="5 5"
                dot={false}
                name="Expected Hashrate"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {!hideTemp && (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatXAxis}
                  interval="preserveStart"
                />
                <YAxis
                  domain={[30, "auto"]}
                  label={{
                    value: "Temp °C",
                    angle: -90,
                    position: "insideLeft",
                    dy: 30,
                  }}
                />
                <Tooltip
                  labelFormatter={(label) => new Date(label).toLocaleString()}
                />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey={() => 60}
                  stroke="#ff7300"
                  strokeDasharray="5 5"
                  dot={false}
                  name="Warning Temp"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinerStatus;
