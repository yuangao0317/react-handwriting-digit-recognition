import { RECOGNIZE, CLEAR } from '../constants/ActionTypes';

/* Actions */
export function recognize(recognizeResult) {
  return {
    type: RECOGNIZE,
    recognizeResult
  };
}

export function clear() {
  return {
    type: CLEAR
  };
}


/* Action creators that return functions to perform conditional dispatches.
  Here we need to pass changed value to actions
 */
export function recognizeAsync(canvas) {
  return dispatch => {
    setTimeout(() => {

      // dispatch(recognize(recognizeResult));
    }, 1000);
  };
}


export function clearCanvas() {
  return (dispatch, getState) => {
    /* 
    const { player, playlists } = getState();
    const { currentSongIndex, selectedPlaylists } = player;
    const currentPlaylist = selectedPlaylists[selectedPlaylists.length - 1];
    */
    const { canvasState } = getState();
    dispatch(clear());
  };
}


