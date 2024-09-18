export const formatUptime = (seconds: number) => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
};

export const formatHashrate = (hashrate: number) => {
  return `${(hashrate / 1000).toFixed(2)} Th/s`;
};