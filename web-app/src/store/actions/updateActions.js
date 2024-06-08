// updateActions.js
export const ADD_UPDATE = 'ADD_UPDATE';
export const CLEAR_UPDATES = 'CLEAR_UPDATES';

export const addUpdate = (update) => ({
  type: ADD_UPDATE,
  payload: update,
});

export const clearUpdates = () => ({
  type: CLEAR_UPDATES,
});