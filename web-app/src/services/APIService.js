import m from "mithril";
import config from "config";

const buildUrl = (endpoint, params = null) => {
  let url = `${config.API.prefix}/${config.API.version}${endpoint}`;

  if (params) {
    const queryParams = new URLSearchParams(params).toString();
    url += `?${queryParams}`;
  }

  return url;
};

const APIService = {
  defaultHeaders: {
    Accept: "application/json", // Assuming you expect JSON responses by default
  },

  setDefaultHeaders: headers => {
    APIService.defaultHeaders = { ...APIService.defaultHeaders, ...headers };
  },

  request: async (method, endpoint, data = null, params = null, options = {}) => {
    const url = buildUrl(endpoint, params);
    const headers = {
      ...APIService.defaultHeaders,
      ...options.headers,
    };

    if (data && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const requestOptions = {
      method,
      url,
      body: data ? data : null,
      headers,
      withCredentials: options.withCredentials || false, // Allows cookies/auth to be sent
      timeout: options.timeout || 15000, // Timeout after 15 seconds
      ...options,
    };

    try {
      const response = await m.request(requestOptions);

      // Optional check for specific expected response status
      if (response.status && (response.status < 200 || response.status >= 300)) {
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      console.error(`API ${method} request to ${url} failed:`, error);
      throw new Error(`Request failed: ${error.message}`);
    }
  },

  get: (endpoint, params = {}, options = {}) => {
    return APIService.request("GET", endpoint, null, params, options);
  },

  post: (endpoint, data = {}, options = {}) => {
    return APIService.request("POST", endpoint, data, null, options);
  },

  put: (endpoint, data = {}, options = {}) => {
    return APIService.request("PUT", endpoint, data, null, options);
  },

  delete: (endpoint, options = {}) => {
    return APIService.request("DELETE", endpoint, null, null, options);
  },
};

export default APIService;
