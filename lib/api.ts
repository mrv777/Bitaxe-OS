const defaultHeaders = {
  Accept: "application/json, text/plain, */*",
  Connection: "keep-alive",
};

// This will use the proxy to access the Bitaxe API
const BASE_URL = '/api/proxy?url=';

const CheckApiUrl = (baseUrl?: string) => {
  let correctedUrl = baseUrl || localStorage.getItem("bitaxeApiUrl");
  if (!correctedUrl.startsWith("http://")) {
    correctedUrl = "http://" + correctedUrl;
  }
  if (!correctedUrl.endsWith("/api")) {
    correctedUrl = correctedUrl.replace(/\/?$/, "/api");
  }
  return correctedUrl;
};

export const api = {
  async getAllStatus(baseUrl?: string) {
    const url = CheckApiUrl(baseUrl);
    const response = await fetch(`${BASE_URL}${encodeURIComponent(`${url}/system/info`)}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  },

  async getSwarm(baseUrl?: string) {
    const url = CheckApiUrl(baseUrl);
    const response = await fetch(`${BASE_URL}${encodeURIComponent(`${url}/swarm/info`)}`, {
      method: "GET",
      headers: defaultHeaders,
    });
    return response.json();
  },

  async updateSettings(settings: any, baseUrl?: string) {
    const url = CheckApiUrl(baseUrl);
    const response = await fetch(`${BASE_URL}${encodeURIComponent(`${url}/system`)}`, {
      method: "PATCH",
      headers: { ...defaultHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    return response;
  },

  async restartSystem(baseUrl?: string) {
    const url = CheckApiUrl(baseUrl);
    const response = await fetch(`${BASE_URL}${encodeURIComponent(`${url}/system/restart`)}`, {
      method: "POST",
      headers: defaultHeaders,
    });
    return response.json();
  },

  async updateSwarm(data: { ip: string }[], baseUrl?: string) {
    const url = CheckApiUrl(baseUrl);
    const response = await fetch(`${BASE_URL}${encodeURIComponent(`${url}/swarm`)}`, {
      method: "PATCH",
      headers: { ...defaultHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response;
  },
};
