"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import LocalDashboard from "./LocalDashboard";
import SwarmDashboard from "./SwarmDashboard";
import Header from "./Header";
import Settings from "./Settings";
import ApiUrlForm from "./ApiUrlForm";
import { DashboardData } from "../types";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'local' | 'swarm' | 'settings'>('local');
  const [apiUrl, setApiUrl] = useState<string | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const { data, isLoading, error, refetch } = useQuery<DashboardData>({
    queryKey: ["allStatus"],
    queryFn: () => api.getAllStatus(),
    refetchInterval: 10000,
    enabled: !!apiUrl,
    onSettled: () => setIsFirstLoad(false),
  });

  useEffect(() => {
    const savedApiUrl = localStorage.getItem('bitaxeApiUrl');
    if (savedApiUrl) {
      setApiUrl(savedApiUrl);
    }
  }, []);

  const handleApiUrlSubmit = () => {
    setApiUrl(localStorage.getItem('bitaxeApiUrl'));
    refetch();
  };

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
          <div className="tabs tabs-boxed mb-4">
            <button
              className={`tab ${activeTab === 'local' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('local')}
            >
              Local
            </button>
            <button
              className={`tab ${activeTab === 'swarm' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('swarm')}
            >
              Swarm
            </button>
          </div>

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
