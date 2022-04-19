import { combineReducers } from "redux";

import alert from "./reducers/alert";
import auth from "./reducers/auth";
import loading from "./reducers/loading";
import layout from "./reducers/layout";

const rootReducer = combineReducers({
  alert,
  auth,
  loading,
  layout,
});

export default rootReducer;
