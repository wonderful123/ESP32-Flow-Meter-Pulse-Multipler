import {
  combineReducers
} from 'redux';
import errorReducer from './errorReducer';
import updateReducer from './updateReducer';

const rootReducer = combineReducers({
  errors: errorReducer,
  updates: updateReducer,
});

export default rootReducer;