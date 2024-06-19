// APIService.js
import m from 'mithril';
import config from 'config';

const buildUrl = (endpoint) => {
  return `${config.API.baseURL}:${config.API.port}/${config.API.prefix}/${config.API.version}${endpoint}`;
};

const APIService = {
  defaultHeaders: {},

  setDefaultHeaders: (headers) => {
    APIService.defaultHeaders = headers;
  },

  request: (method, endpoint, data = null, params = null, options = {}) => {
    const url = buildUrl(endpoint);
    const headers = {
      ...APIService.defaultHeaders,
      ...options.headers,
    };

    if (data && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const requestOptions = {
      method: method,
      url: url,
      body: data,
      params: params,
      headers: headers,
      ...options,
    };

    return m.request(requestOptions);
  },

  get: (endpoint, params = {}, options = {}) => {
    return APIService.request('GET', endpoint, null, params, options);
  },

  post: (endpoint, data = {}, options = {}) => {
    return APIService.request('POST', endpoint, data, null, options);
  },

  put: (endpoint, data = {}, options = {}) => {
    return APIService.request('PUT', endpoint, data, null, options);
  },

  delete: (endpoint, options = {}) => {
    return APIService.request('DELETE', endpoint, null, null, options);
  },
};

export default APIService;