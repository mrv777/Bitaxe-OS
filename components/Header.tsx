"use client";

import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const themes = [
  "dark", "light", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", 
  "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", 
  "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", 
  "autumn", "business", "acid", "lemonade", "night", "coffee", "winter", "dim", "nord", "sunset"
];

interface HeaderProps {
  networkStatus: {
    wifiStatus: string;
    ssid: string;
    hostname: string;
  };
  onSettingsClick: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ networkStatus, onSettingsClick }) => {
  const [theme, setTheme] = useState<string>('dark');
  const [apiBaseUrl, setApiBaseUrl] = useState<string>('');
  const queryClient = useQueryClient();

  useEffect(() => {
    // Load theme from localStorage on initial render
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }

    // Load API base URL from localStorage on initial render
    const storedApiBaseUrl = localStorage.getItem('bitaxeApiUrl');
    if (storedApiBaseUrl) {
      setApiBaseUrl(storedApiBaseUrl);
    }
  }, []);

  const updateTheme = (theme: string) => {
    setTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  const handleApiBaseUrlChange = (newUrl: string) => {
    localStorage.setItem('bitaxeApiUrl', newUrl);
    queryClient.invalidateQueries();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleApiBaseUrlChange(event.currentTarget.value);
    }
  };

  const isConnected = networkStatus.wifiStatus === "Connected!";

  const resetLocalStorage = () => {
    const apiUrl = localStorage.getItem('bitaxeApiUrl');
    const currentTheme = localStorage.getItem('theme');
    localStorage.clear();
    if (apiUrl) localStorage.setItem('bitaxeApiUrl', apiUrl);
    if (currentTheme) localStorage.setItem('theme', currentTheme);
    window.location.reload();
  };

  return (
    <header className="navbar bg-base-300 shadow-lg mb-4">
      <div className="flex-1" onClick={() => onSettingsClick('local')}>
        <a className="btn btn-ghost normal-case text-xl">
          <span className="hidden sm:inline">AXE-OS Dashboard</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </a>
      </div>
      <div className="flex-none gap-2">
        <div className="tooltip tooltip-bottom" data-tip={`Connected as ${networkStatus.hostname} on ${networkStatus.ssid}`}>
          <div className={`indicator ${isConnected ? 'text-success' : 'text-error'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          </div>
        </div>
        <button onClick={() => onSettingsClick('settings')} className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn m-1">
            Theme
            <svg width="12px" height="12px" className="h-2 w-2 fill-current opacity-60 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path></svg>
          </label>
          <ul tabIndex={0} className="dropdown-content z-[1] p-2 shadow-2xl bg-base-200 rounded-box w-52 max-h-96 overflow-y-auto">
            {themes.map((t) => (
              <li key={t}>
                <input
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label={t}
                  value={t}
                  checked={theme === t}
                  onChange={() => updateTheme(t)}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="form-control">
          <input
            type="text"
            placeholder="API Base URL"
            className="input input-bordered input-sm w-full max-w-xs"
            value={apiBaseUrl}
            onChange={(e) => setApiBaseUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={(e) => handleApiBaseUrlChange(e.target.value)}
          />
        </div>
        <button onClick={resetLocalStorage} className="btn btn-ghost btn-circle tooltip flex items-center justify-center" data-tip="Reset Charts">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;