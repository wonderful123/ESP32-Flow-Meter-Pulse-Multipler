import { combineReducers } from "redux";
import errorReducer from "./errorReducer";
import updateReducer from "./updateReducer";
import calibrationReducer from "./calibrationReducer";
import websocketReducer from "./webSocketReducer";

const rootReducer = combineReducers({
  errors: errorReducer,
  updates: updateReducer,
  calibration: calibrationReducer,
  websocket: websocketReducer,
});

export default rootReducer;
