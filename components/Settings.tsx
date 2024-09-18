import React, { useState, useEffect, useRef } from "react";
import { api } from "../lib/api";
import {
  frequencyOptions,
  coreVoltageOptions,
  DropdownOption,
} from "../lib/asicDefaults";

interface SettingsProps {
  data: {
    hostname: string;
    ssid: string;
    stratumURL: string;
    stratumPort: number;
    stratumUser: string;
    frequency: number;
    coreVoltage: number;
    autofanspeed: number;
    fanspeed: number;
    flipscreen: number;
    ASICModel: string;
  };
}

const Settings: React.FC<SettingsProps> = ({ data }) => {
  const [settings, setSettings] = useState({
    hostname: data.hostname,
    ssid: data.ssid,
    wifiPassword: "",
    stratumURL: data.stratumURL,
    stratumPort: data.stratumPort,
    stratumUser: data.stratumUser,
    stratumPassword: "",
    frequency: data.frequency,
    coreVoltage: data.coreVoltage,
    fanControl: data.autofanspeed,
    fanSpeed: data.fanspeed,
    flipscreen: data.flipscreen,
  });

  const [expertMode, setExpertMode] = useState({
    frequency: false,
    coreVoltage: false,
  });

  const successModalRef = useRef<HTMLDialogElement>(null);
  const errorModalRef = useRef<HTMLDialogElement>(null);

  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const frequencyOptions = getOptions("frequency");
    const coreVoltageOptions = getOptions("coreVoltage");

    setExpertMode({
      frequency:
        frequencyOptions.length === 0 ||
        !frequencyOptions.some((option) => option.value === data.frequency),
      coreVoltage:
        coreVoltageOptions.length === 0 ||
        !coreVoltageOptions.some((option) => option.value === data.coreVoltage),
    });
  }, [data.ASICModel, data.frequency, data.coreVoltage]);

  const handleExpertModeChange = (field: "frequency" | "coreVoltage") => {
    setExpertMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
            ? 1
            : 0
          : name === "fanSpeed"
          ? parseInt(value, 10)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.updateSettings(settings);
      if (response.ok) {
        successModalRef.current?.showModal();
      } else {
        throw new Error(await response.text() || 'Failed to update settings. Please try again.');
      }
    } catch (error) {
      errorModalRef.current?.showModal();
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const getOptions = (type: "frequency" | "coreVoltage"): DropdownOption[] => {
    const options =
      type === "frequency" ? frequencyOptions : coreVoltageOptions;
    return options[data.ASICModel] || [];
  };

  return (
    <>
      <div className="card bg-base-300 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Settings</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First column */}
              <div className="space-y-4">
                {/* Hostname input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Hostname</span>
                  </label>
                  <input
                    type="text"
                    name="hostname"
                    value={settings.hostname}
                    onChange={handleChange}
                    className="input input-bordered"
                  />
                </div>
                {/* SSID input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">SSID</span>
                  </label>
                  <input
                    type="text"
                    name="ssid"
                    value={settings.ssid}
                    onChange={handleChange}
                    className="input input-bordered"
                  />
                </div>
                {/* WiFi Password input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">WiFi Password</span>
                  </label>
                  <input
                    type="password"
                    name="wifiPassword"
                    value={settings.wifiPassword}
                    onChange={handleChange}
                    className="input input-bordered"
                    placeholder="<Hidden>"
                  />
                </div>
                {/* Flipscreen checkbox */}
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Flip Screen</span>
                    <input
                      type="checkbox"
                      name="flipscreen"
                      checked={settings.flipscreen === 1}
                      onChange={handleChange}
                      className="checkbox"
                    />
                  </label>
                </div>
              </div>

              {/* Second column */}
              <div className="space-y-4">
                {/* Stratum URL input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Stratum URL</span>
                  </label>
                  <input
                    type="text"
                    name="stratumURL"
                    value={settings.stratumURL}
                    onChange={handleChange}
                    className="input input-bordered"
                  />
                </div>
                {/* Stratum Port input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Stratum Port</span>
                  </label>
                  <input
                    type="number"
                    name="stratumPort"
                    value={settings.stratumPort}
                    onChange={handleChange}
                    className="input input-bordered"
                  />
                </div>
                {/* Stratum User input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Stratum User</span>
                  </label>
                  <input
                    type="text"
                    name="stratumUser"
                    value={settings.stratumUser}
                    onChange={handleChange}
                    className="input input-bordered"
                  />
                </div>
                {/* Stratum Password input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Stratum Password</span>
                  </label>
                  <input
                    type="password"
                    name="stratumPassword"
                    value={settings.stratumPassword}
                    onChange={handleChange}
                    className="input input-bordered"
                    placeholder="<Hidden>"
                  />
                </div>
              </div>
            </div>

            {/* Additional inputs below the two columns */}
            <div className="space-y-4 mt-4">
              {/* Frequency input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Frequency (MHz)</span>
                  <label className="label cursor-pointer">
                    <span className="label-text mr-2">Expert Mode</span>
                    <input
                      type="checkbox"
                      checked={expertMode.frequency}
                      onChange={() => handleExpertModeChange("frequency")}
                      className="checkbox checkbox-sm"
                    />
                  </label>
                </label>
                {expertMode.frequency ? (
                  <input
                    type="number"
                    name="frequency"
                    value={settings.frequency}
                    onChange={handleChange}
                    className="input input-bordered"
                  />
                ) : (
                  <select
                    name="frequency"
                    value={settings.frequency}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    {getOptions("frequency").map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {/* Core Voltage input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Core Voltage (mV)</span>
                  <label className="label cursor-pointer">
                    <span className="label-text mr-2">Expert Mode</span>
                    <input
                      type="checkbox"
                      checked={expertMode.coreVoltage}
                      onChange={() => handleExpertModeChange("coreVoltage")}
                      className="checkbox checkbox-sm"
                    />
                  </label>
                </label>
                {expertMode.coreVoltage ? (
                  <input
                    type="number"
                    name="coreVoltage"
                    value={settings.coreVoltage}
                    onChange={handleChange}
                    className="input input-bordered"
                  />
                ) : (
                  <select
                    name="coreVoltage"
                    value={settings.coreVoltage}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    {getOptions("coreVoltage").map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {/* Fan Speed input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Fan Speed</span>
                  <span className="label-text-alt">{settings.fanSpeed}%</span>
                </label>
                <input
                  type="range"
                  name="fanSpeed"
                  min="0"
                  max="100"
                  value={settings.fanSpeed}
                  onChange={handleChange}
                  className="range range-primary"
                />
                <div className="w-full flex justify-between text-xs px-2">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <dialog ref={successModalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Success!</h3>
          <p className="py-4">Settings updated successfully.</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-primary">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Error Modal */}
      <dialog ref={errorModalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Error</h3>
          <p className="py-4">{errorMessage || 'Failed to update settings. Please try again.'}</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-primary">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Settings;
