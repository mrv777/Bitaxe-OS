import { useState } from "react";

export const useActiveTab = () => {
  const [activeTab, setActiveTab] = useState<'local' | 'swarm' | 'settings'>('local');
  return { activeTab, setActiveTab };
};