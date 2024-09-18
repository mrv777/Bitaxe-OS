import React from "react";
import MinerStatus from "./MinerStatus";
import SystemStatus from "./SystemStatus";
import DetailedStatus from "./DetailedStatus";
import { DashboardData } from "../types";

interface LocalDashboardProps {
  data: DashboardData;
}

const LocalDashboard: React.FC<LocalDashboardProps> = ({ data }) => {
  return (
    <>
      <MinerStatus data={data} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <SystemStatus data={data} />
        <DetailedStatus data={data} />
      </div>
    </>
  );
};

export default LocalDashboard;