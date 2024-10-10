// errorActions.js
export const ADD_ERROR = 'ADD_ERROR';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

export const addError = (message, status = null) => ({
  type: ADD_ERROR,
  payload: {
    message,
    status,
    timestamp: new Date().toISOString(),
  },
});

export const clearErrors = () => ({
  type: CLEAR_ERRORS,
});