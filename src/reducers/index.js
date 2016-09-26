import { combineReducers } from 'redux';

/* Import children reducers here */
import canvasReducer from './canvasReducer';

const rootReducer = combineReducers({
  canvasReducer: canvasReducer,
});

export default rootReducer;