const defaultHeaders = {
  Accept: "application/json, text/plain, */*",
  Connection: "keep-alive",
};

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
    const response = await fetch(`${url}/system/info`, {
      method: "GET",
      headers: defaultHeaders,
    });
    return response.json();
  },

  async getSwarm(baseUrl?: string) {
    const url = CheckApiUrl(baseUrl);
    const response = await fetch(`${url}/swarm/info`, {
      method: "GET",
      headers: defaultHeaders,
    });
    return response.json();
  },

  async updateSettings(settings: any, baseUrl?: string) {
    const url = CheckApiUrl(baseUrl);
    const response = await fetch(`${url}/system`, {
      method: "PATCH",
      headers: { ...defaultHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    return response;
  },

  async restartSystem(baseUrl?: string) {
    const url = CheckApiUrl(baseUrl);
    const response = await fetch(`${url}/system/restart`, {
      method: "POST",
      headers: defaultHeaders,
    });
    return response.json();
  },
};
