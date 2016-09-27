import { RECOGNIZE, CLEAR } from '../constants/ActionTypes';

/* Initialize state here 
const initialState = {
  object1: null,
  value1: 0,
  array1: []
};
*/
const initialState = {
	recognizeResult: null
}

export default function canvasReducer(state = initialState, action) {
	/* here we can get the changed state from the action's return object */

  switch (action.type) {
  case RECOGNIZE:
    return Object.assign({}, state, {
        recognizeResult: action.recognizeResult,
      });
  case CLEAR:
    return Object.assign({}, state, {
        recognizeResult: action.recognizeResult,
      });
  default:
    return state;
  }
}
