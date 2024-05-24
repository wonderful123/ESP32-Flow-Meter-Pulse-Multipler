// errorActions.js
export const ADD_ERROR = 'ADD_ERROR';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

export const addError = (error) => ({
  type: ADD_ERROR,
  payload: error,
});

export const clearErrors = () => ({
  type: CLEAR_ERRORS,
});