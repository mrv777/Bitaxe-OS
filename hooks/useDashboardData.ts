import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { DashboardData } from "../types";

export const useDashboardData = () => {
  const [apiUrl, setApiUrl] = useState<string | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const savedApiUrl = localStorage.getItem('bitaxeApiUrl');
    if (savedApiUrl) {
      setApiUrl(savedApiUrl);
    } else {
      setIsFirstLoad(false);
    }
  }, []);

  const { data, isLoading, error, refetch } = useQuery<DashboardData>({
    queryKey: ["allStatus"],
    queryFn: () => api.getAllStatus(),
    refetchInterval: 10000,
    enabled: !!apiUrl,
    onSettled: () => setIsFirstLoad(false),
  });

  const handleApiUrlSubmit = () => {
    setApiUrl(localStorage.getItem('bitaxeApiUrl'));
    refetch();
  };

  return { data, isLoading, error, isFirstLoad, apiUrl, handleApiUrlSubmit };
};