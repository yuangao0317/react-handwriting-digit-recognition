import { combineReducers } from 'redux';

/* Import children reducers here */
import childReducer1 from './childReducer1'; // Fake 

const rootReducer = combineReducers({
  childReducer1: childReducer1,
});

export default rootReducer;