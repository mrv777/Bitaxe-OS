"use client";

import React from "react";
import Header from "./Header";
import Settings from "./Settings";
import ApiUrlForm from "./ApiUrlForm";
import TabNavigation from "./TabNavigation";
import LocalDashboard from "./LocalDashboard";
import SwarmDashboard from "./SwarmDashboard";
import { useDashboardData } from "../hooks/useDashboardData";
import { useActiveTab } from "../hooks/useActiveTab";

const Dashboard: React.FC = () => {
  const { data, isLoading, error, isFirstLoad, apiUrl, handleApiUrlSubmit } = useDashboardData();
  const { activeTab, setActiveTab } = useActiveTab();

  if (isLoading && isFirstLoad) return <div>Loading dashboard...</div>;

  if (!apiUrl || error || (isLoading && !isFirstLoad)) {
    return <ApiUrlForm onSubmit={handleApiUrlSubmit} apiUrl={apiUrl} error={error || isLoading ? true : false} />;
  }

  return (
    <>
      <Header 
        networkStatus={{
          wifiStatus: data.wifiStatus,
          ssid: data.ssid,
          hostname: data.hostname
        }} 
        onSettingsClick={(screen: 'local' | 'swarm' | 'settings') => setActiveTab(screen)}
      />
      {activeTab === 'settings' ? (
        <Settings data={data} />
      ) : (
        <>
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === 'local' ? (
            <LocalDashboard data={data} />
          ) : (
            <SwarmDashboard />
          )}
        </>
      )}
    </>
  );
};

export default Dashboard;
