import { ACTION1, ACTION2 } from '../constants/ActionTypes';

export function increment() {
  return {
    type: ACTION1
  };
}

export function decrement() {
  return {
    type: ACTION2
  };
}

export function incrementIfOdd() {
  return (dispatch, getState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}

export function incrementAsync() {
  return dispatch => {
    setTimeout(() => {
      dispatch(increment());
    }, 1000);
  };
}
