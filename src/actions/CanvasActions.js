import { RECOGNIZE, CLEAR } from '../constants/ActionTypes';

import ImageProcessor from '../utils/ImageProcessor';

/* Actions */
export function recognize(recognizeResult) {
  return {
    type: RECOGNIZE,
    recognizeResult
  };
}

export function clear() {
  return {
    type: CLEAR,
    recognizeResult: null
  };
}


/* Action creators that return functions to perform conditional dispatches.
  Here we need to pass changed value to actions
 */
export function recognizeAsync(canvasData) {

  return dispatch => {
    setTimeout(() => {
      console.log("action");
      let imageProcessor = new ImageProcessor(canvasData);
      let prediction = imageProcessor.analyseImage();

      dispatch(recognize(prediction));
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


