import { push } from 'react-router-redux';
import qs from 'query-string';

export const ACTION_RETRO = 'retro/success';
export const RETRO_RECEIVED = 'RETRO_RECEIVED';

export const ACTION_RETRO_NEW = 'retro/new';
export const RETRO_NEW_IN_PROGRESS = 'RETRO_NEW_IN_PROGRESS';
export const RETRO_NEW_SUCCESS = 'RETRO_NEW_SUCCESS';
export const RETRO_NEW_FAILURE = 'RETRO_NEW_FAILURE';

export const ACTION_RETRO_RENAME = 'retro/rename';
export const RETRO_RENAME_IN_PROGRESS = 'RETRO_RENAME_IN_PROGRESS';
export const RETRO_RENAME_SUCCESS = 'RETRO_RENAME_SUCCESS';
export const RETRO_RENAME_FAILURE = 'RETRO_RENAME_FAILURE';

export const ACTION_RETRO_JOIN = 'retro/join';
export const RETRO_JOIN_IN_PROGRESS = 'RETRO_JOIN_IN_PROGRESS';
export const RETRO_JOIN_SUCCESS = 'RETRO_JOIN_SUCCESS';
export const RETRO_JOIN_FAILURE = 'RETRO_JOIN_FAILURE';

export const ACTION_RETRO_LEAVE = 'retro/leave/success';
export const RETRO_LEAVE = 'RETRO_LEAVE';

export const setRetroIdQueryParameter = retroId => (dispatch) => {
  const query = { r: retroId };
  const searchString = qs.stringify(query);

  dispatch(push({
    search: searchString
  }));
};

export const retroCreate = (socket, name) => (dispatch) => {
  socket.emit(ACTION_RETRO_NEW, { name });
  dispatch({ type: RETRO_NEW_IN_PROGRESS });
};

export const retroRename = (socket, name) => (dispatch) => {
  socket.emit(ACTION_RETRO_RENAME, { name });
  dispatch({ type: RETRO_RENAME_IN_PROGRESS });
};

export const retroJoin = (socket, shareId) => (dispatch) => {
  socket.emit(ACTION_RETRO_JOIN, { id: shareId });
  dispatch({ type: RETRO_JOIN_IN_PROGRESS });
};
