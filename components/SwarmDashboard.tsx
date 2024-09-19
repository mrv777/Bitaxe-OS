"use client";

import React, { useState, useCallback } from "react";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import MinerStatus from "./MinerStatus";
import AddToSwarmForm from "./AddToSwarmForm"

// Memoize the MinerStatus component
const MemoizedMinerStatus = React.memo(MinerStatus);

interface SwarmMember {
  ip: string;
}

const SwarmDashboard: React.FC = () => {
  const {
    data: swarmData,
    isLoading: swarmLoading,
    error: swarmError,
  } = useQuery<SwarmMember[]>({
    queryKey: ["getSwarm"],
    queryFn: () => api.getSwarm(undefined),
  });

  const queryClient = useQueryClient();

  const uniqueIps = React.useMemo(() => {
    if (!swarmData) return [];
    return Array.from(new Set(swarmData.map((member) => member.ip)));
  }, [swarmData]);

  const statusQueries = useQueries({
    queries: uniqueIps.map((ip) => ({
      queryKey: ["allStatus", ip],
      queryFn: () => api.getAllStatus(`http://${ip}/api`),
      refetchInterval: 10000,
    })),
  });

  const parseDifficulty = (diffString: string): number => {
    const match = diffString.match(/^(\d+(\.\d+)?)\s*([EPMGTK]?)$/i);
    if (!match) return 0;

    const [, value, , suffix] = match;
    const numericValue = parseFloat(value);

    const multipliers: { [key: string]: number } = {
      E: 1e18,
      P: 1e15,
      T: 1e12,
      G: 1e9,
      M: 1e6,
      K: 1e3,
    };

    return numericValue * (multipliers[suffix.toUpperCase()] || 1);
  };

  const combinedData = React.useMemo(() => {
    // Only proceed if we have data from all miners
    if (statusQueries.every(query => query.data)) {
      const combined = statusQueries.reduce(
        (acc, query) => ({
          hashRate: acc.hashRate + query.data.hashRate,
          bestDiff: Math.max(
            acc.bestDiff,
            parseDifficulty(query.data.bestDiff)
          ),
          bestSessionDiff: Math.max(
            acc.bestSessionDiff,
            parseDifficulty(query.data.bestSessionDiff)
          ),
          temp: acc.temp + query.data.temp,
          sharesAccepted: acc.sharesAccepted + query.data.sharesAccepted,
          sharesRejected: acc.sharesRejected + query.data.sharesRejected,
          frequency: acc.frequency + query.data.frequency,
          smallCoreCount: acc.smallCoreCount + query.data.smallCoreCount,
          asicCount: acc.asicCount + query.data.asicCount,
          power: acc.power + query.data.power,
          ASICModel: query.data.ASICModel,
          hostname: acc.hostname
            ? `${acc.hostname}-${query.data.hostname}`
            : query.data.hostname,
          stratumUser: acc.stratumUser
            ? `${acc.stratumUser}-${query.data.stratumUser}`
            : query.data.stratumUser,
        }),
        {
          hashRate: 0,
          bestDiff: 0,
          bestSessionDiff: 0,
          temp: 0,
          sharesAccepted: 0,
          sharesRejected: 0,
          frequency: 0,
          smallCoreCount: 0,
          asicCount: 0,
          power: 0,
          ASICModel: "",
          hostname: "",
          stratumUser: "",
        }
      );

      // Calculate averages for relevant fields
      const queryCount = statusQueries.length;
      combined.temp /= queryCount;
      combined.smallCoreCount /= queryCount;
      combined.asicCount /= queryCount;

      combined.hashRate = combined.hashRate > 0 ? combined.hashRate : null;

      return combined;
    }
    return null;
  }, [statusQueries]);

  const [visibleColumns, setVisibleColumns] = useState({
    ip: true,
    asicModel: false,
    bestDiff: true,
    hashRate: true,
    temp: true,
    frequency: true,
    voltage: true,
    power: true,
    delete: true,
  });

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const addToSwarm = useCallback(async (newIp: string) => {
    if (newIp && swarmData) {
      try {
        const updatedSwarm = [
          ...swarmData,
          { ip: newIp }
        ];
        await api.updateSwarm(updatedSwarm);
        await queryClient.invalidateQueries();
      } catch (error) {
        console.error("Failed to add to swarm:", error);
      }
    }
  }, [swarmData, queryClient]);

  const removeFromSwarm = async (ip: string) => {
    try {
      const updatedSwarm = swarmData.filter(member => member.ip !== ip);
      await api.updateSwarm(updatedSwarm);
      // Refetch swarm data
      await queryClient.invalidateQueries();
    } catch (error) {
      console.error("Failed to remove from swarm:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  if (swarmLoading) return <div>Loading swarm data...</div>;
  if (swarmError) return <div>Error loading swarm data</div>;

  return (
    <div>
      {combinedData ? (
        <div>
          <h2 className="text-2xl font-bold">Combined Miner Status</h2>
          <MemoizedMinerStatus
            data={{
              ...combinedData,
              bestDiff: combinedData.bestDiff,
              bestSessionDiff: combinedData.bestSessionDiff,
            }}
            hideTemp={true}
            showDiff={true}
          />
        </div>
      ) : (
        <div className="text-center py-4">
          <h2 className="text-2xl font-bold">Combined Miner Status</h2>
          <p>Waiting for data from all miners...</p>
        </div>
      )}
      <div className="divider" />
      <div className="flex justify-end mb-4">
        <div className="dropdown mb-4">
          <label tabIndex={0} className="btn m-1">
            Select Columns
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            {Object.entries(visibleColumns).map(([column, isVisible]) => (
              <li key={column}>
                <label className="label cursor-pointer">
                  <span className="label-text capitalize">{column}</span>
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() =>
                      toggleColumn(column as keyof typeof visibleColumns)
                    }
                    className="checkbox"
                  />
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <table className="table table-compact">
        <thead>
          <tr>
            <th className={visibleColumns.ip ? "" : "hidden"}>Device</th>
            <th className={visibleColumns.asicModel ? "" : "hidden"}>
              ASIC Model
            </th>
            <th className={visibleColumns.bestDiff ? "" : "hidden"}>
              Best Diff
            </th>
            <th className={visibleColumns.hashRate ? "" : "hidden"}>
              Hash Rate
            </th>
            <th className={visibleColumns.temp ? "" : "hidden"}>Temp</th>
            <th className={visibleColumns.frequency ? "" : "hidden"}>
              Frequency
            </th>
            <th className={visibleColumns.voltage ? "" : "hidden"}>Voltage</th>
            <th className={visibleColumns.power ? "" : "hidden"}>Power</th>
            <th className={visibleColumns.delete ? "" : "hidden"}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {statusQueries.map((query, index) => (
            <tr key={uniqueIps[index]}>
              <td className={visibleColumns.ip ? "" : "hidden"}>
                <div>{uniqueIps[index]}</div>
                <div className="text-sm text-gray-500">
                  ({query.data?.hostname})
                </div>
              </td>
              <td className={visibleColumns.asicModel ? "" : "hidden"}>
                {query.data?.ASICModel || "N/A"}
              </td>
              <td className={visibleColumns.bestDiff ? "" : "hidden"}>
                {query.data?.bestSessionDiff || "N/A"}{" "}
                <span className="tooltip cursor-help" data-tip="All Time">
                  ({query.data?.bestDiff || "N/A"})
                </span>
              </td>
              <td className={visibleColumns.hashRate ? "" : "hidden"}>
                {query.data?.hashRate.toFixed(2)} Gh/s
              </td>
              <td
                className={`${visibleColumns.temp ? "" : "hidden"} ${
                  query.data?.temp >= 60 ? "text-red-500" : "text-green-500"
                }`}
              >
                {query.data?.temp}°C
              </td>
              <td className={visibleColumns.frequency ? "" : "hidden"}>
                {query.data?.frequency} MHz
              </td>
              <td
                className={`${visibleColumns.voltage ? "" : "hidden"} ${
                  query.data?.voltage > 4940
                    ? "text-green-500"
                    : query.data?.voltage > 4800
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {(query.data?.voltage / 1000).toFixed(2)}V
              </td>
              <td className={visibleColumns.power ? "" : "hidden"}>
                {query.data?.power.toFixed(2)}W
              </td>
              <td className={visibleColumns.delete ? "" : "hidden"}>
                <button
                  onClick={() => removeFromSwarm(uniqueIps[index])}
                  className="btn btn-error btn-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <AddToSwarmForm onSubmit={addToSwarm} />
      </div>
    </div>
  );
};

export default SwarmDashboard;
