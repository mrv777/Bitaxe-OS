import React from "react";

interface TabNavigationProps {
  activeTab: 'local' | 'swarm' | 'settings';
  setActiveTab: (tab: 'local' | 'swarm' | 'settings') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
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
  );
};

export default TabNavigation;