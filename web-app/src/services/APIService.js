import m from 'mithril';
import config from '/config';
import store from '../store/store';
import {
  addError
} from '../actions/errorActions';

const buildUrl = (endpoint) => {
  return `${config.API.baseURL}/v${config.API.version}${endpoint}`;
};

const APIService = {
  get: (endpoint, params = {}, options = {}) => {
    return m.request({
      method: 'GET',
      url: buildUrl(endpoint),
      params: params,
      ...options,
    }).catch(handleError);
  },

  post: (endpoint, data = {}, options = {}) => {
    return m.request({
      method: 'POST',
      url: buildUrl(endpoint),
      body: data,
      ...options,
    }).catch(handleError);
  },

  put: (endpoint, data = {}, options = {}) => {
    return m.request({
      method: 'PUT',
      url: buildUrl(endpoint),
      body: data,
      ...options,
    }).catch(handleError);
  },

  delete: (endpoint, options = {}) => {
    return m.request({
      method: 'DELETE',
      url: buildUrl(endpoint),
      ...options,
    }).catch(handleError);
  },

  setTimeout: (timeout) => {
    m.request.config({
      timeout: timeout,
    });
  },

  cancelRequest: (promise) => {
    promise.cancel();
  },
};

const handleError = (error) => {
  if (error.code === 'ECONNABORTED') {
    console.error('Request timed out');
  } else if (error.response) {
    console.error('HTTP error:', error.response.status, error.response.statusText);
  } else {
    console.error('Error:', error.message);
  }
  store.dispatch(addError(error.message));
  throw error;
};

export default APIService;