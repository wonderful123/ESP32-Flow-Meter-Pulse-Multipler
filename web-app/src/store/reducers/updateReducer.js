// updateReducer.js

import {
  ADD_UPDATE,
  CLEAR_UPDATES
} from '../actions/updateActions';

const initialState = {
  updates: [],
};

const updateReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_UPDATE:
      return {
        ...state,
        updates: [...state.updates, action.payload],
      };
    case CLEAR_UPDATES:
      return {
        ...state,
        updates: [],
      };
    default:
      return state;
  }
};

export default updateReducer;