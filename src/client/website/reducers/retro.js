import deepClone from '../services/utils/deepClone';
import { handleQuery, QUERY_DEFAULT } from '../services/websocket/query';
import {
  RETRO_JOIN_FAILURE,
  RETRO_JOIN_IN_PROGRESS,
  RETRO_JOIN_SUCCESS,
  RETRO_LEAVE,
  RETRO_NEW_FAILURE,
  RETRO_NEW_IN_PROGRESS,
  RETRO_NEW_SUCCESS,
  RETRO_RECEIVED,
  RETRO_RENAME_FAILURE,
  RETRO_RENAME_IN_PROGRESS,
  RETRO_RENAME_SUCCESS
} from '../actions/retro';
import {
  COLUMN_ADD_FAILURE,
  COLUMN_ADD_IN_PROGRESS,
  COLUMN_ADD_SUCCESS,
  COLUMN_EDIT_FAILURE,
  COLUMN_EDIT_IN_PROGRESS,
  COLUMN_EDIT_SUCCESS,
  COLUMN_REMOVE_FAILURE,
  COLUMN_REMOVE_IN_PROGRESS,
  COLUMN_REMOVE_SUCCESS
} from '../actions/column';
import {
  CARD_ADD_FAILURE,
  CARD_ADD_IN_PROGRESS,
  CARD_ADD_SUCCESS,
  CARD_EDIT_FAILURE,
  CARD_EDIT_IN_PROGRESS,
  CARD_EDIT_SUCCESS,
  CARD_REMOVE_FAILURE,
  CARD_REMOVE_IN_PROGRESS,
  CARD_REMOVE_SUCCESS
} from '../actions/card';

// ------------------------------------
// State constants
// ------------------------------------
export const RETRO_NAME_KEY = 'name';
export const RETRO_SHARE_ID_KEY = 'shareId';
export const RETRO_CONNECTED_USERS_KEY = 'connectedUsers';
export const RETRO_USERS_KEY = 'users';
export const RETRO_STAGE_KEY = 'stage';
export const RETRO_SCRUM_MASTER_ID_KEY = 'scrumMasterId';
export const RETRO_COLUMNS_KEY = 'columns';
export const RETRO_CARDS_KEY = 'cards';
export const RETRO_NEW_QUERY_KEY = 'new';
export const RETRO_RENAME_QUERY_KEY = 'rename';
export const RETRO_JOIN_QUERY_KEY = 'join';
export const COLUMN_ADD_QUERY_KEY = 'addColumn';
export const COLUMN_REMOVE_QUERY_KEY = 'removeColumn';
export const COLUMN_EDIT_QUERY_KEY = 'editColumn';
export const CARD_ADD_QUERY_KEY = 'addCard';
export const CARD_REMOVE_QUERY_KEY = 'removeCard';
export const CARD_EDIT_QUERY_KEY = 'editCard';

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  [RETRO_NAME_KEY]: undefined,
  [RETRO_SHARE_ID_KEY]: undefined,
  [RETRO_STAGE_KEY]: undefined,
  [RETRO_CONNECTED_USERS_KEY]: [],
  [RETRO_USERS_KEY]: {},
  [RETRO_COLUMNS_KEY]: [],
  [RETRO_CARDS_KEY]: [],
  [RETRO_NEW_QUERY_KEY]: QUERY_DEFAULT(),
  [RETRO_RENAME_QUERY_KEY]: QUERY_DEFAULT(),
  [RETRO_JOIN_QUERY_KEY]: QUERY_DEFAULT(),
  [COLUMN_ADD_QUERY_KEY]: QUERY_DEFAULT(),
  [COLUMN_REMOVE_QUERY_KEY]: QUERY_DEFAULT(),
  [COLUMN_EDIT_QUERY_KEY]: QUERY_DEFAULT(),
  [CARD_ADD_QUERY_KEY]: QUERY_DEFAULT(),
  [CARD_REMOVE_QUERY_KEY]: QUERY_DEFAULT(),
  [CARD_EDIT_QUERY_KEY]: QUERY_DEFAULT()
};

const ACTION_HANDLERS = {
  ...handleQuery([
    RETRO_JOIN_IN_PROGRESS,
    {
      [RETRO_JOIN_SUCCESS](state, payload) {
        const newState = deepClone(state);
        const { userJoined: { id, name, connections } } = payload;
        newState[RETRO_USERS_KEY][id] = { id, name };
        const found = newState[RETRO_CONNECTED_USERS_KEY].find(u => u.id === id);
        const connectedUser = { id, connections };
        if (!found) {
          newState[RETRO_CONNECTED_USERS_KEY].push(connectedUser);
        } else {
          Object.assign(found, connectedUser);
        }
        return newState;
      }
    },
    RETRO_JOIN_FAILURE
  ], RETRO_JOIN_QUERY_KEY),
  [RETRO_RECEIVED]: (state, { payload }) => {
    const newState = deepClone(state);
    const { name, shareId, stage, scrumMaster, users, columns, cards } = payload;

    newState[RETRO_NAME_KEY] = name;
    newState[RETRO_STAGE_KEY] = stage;
    newState[RETRO_SHARE_ID_KEY] = shareId;
    newState[RETRO_CONNECTED_USERS_KEY] = users
      .filter(user => user.connections)
      .map(user => ({ id: user.user.id, connections: user.connections }));
    const usersObject = {};
    users.forEach((user) => {
      usersObject[user.user.id] = user.user;
    });
    newState[RETRO_USERS_KEY] = usersObject;
    newState[RETRO_SCRUM_MASTER_ID_KEY] = scrumMaster;
    newState[RETRO_COLUMNS_KEY] = columns;
    newState[RETRO_CARDS_KEY] = cards;

    return newState;
  },
  [RETRO_LEAVE]: (state, { payload }) => {
    const newState = deepClone(state);
    const { userLeft: { id, connections } } = payload;

    const userToUpdate = newState[RETRO_CONNECTED_USERS_KEY].find(users => users.id === id);
    if (userToUpdate) {
      userToUpdate.connections = connections;
    }

    return newState;
  },
  ...handleQuery([
    RETRO_NEW_IN_PROGRESS,
    RETRO_NEW_SUCCESS,
    RETRO_NEW_FAILURE
  ], RETRO_NEW_QUERY_KEY),
  ...handleQuery([
    RETRO_RENAME_IN_PROGRESS,
    {
      [RETRO_RENAME_SUCCESS](state, payload) {
        const newState = deepClone(state);
        const { name } = payload;

        newState[RETRO_NAME_KEY] = name;

        return newState;
      }
    },
    RETRO_RENAME_FAILURE
  ], RETRO_RENAME_QUERY_KEY),
  ...handleQuery([
    COLUMN_ADD_IN_PROGRESS,
    {
      [COLUMN_ADD_SUCCESS](state, payload) {
        const newState = deepClone(state);
        newState[RETRO_COLUMNS_KEY].push(payload);

        return newState;
      }
    },
    COLUMN_ADD_FAILURE
  ], COLUMN_ADD_QUERY_KEY),
  ...handleQuery([
    COLUMN_REMOVE_IN_PROGRESS,
    {
      [COLUMN_REMOVE_SUCCESS](state, payload) {
        const newState = deepClone(state);
        const { id } = payload;
        const indexToRemove = newState[RETRO_COLUMNS_KEY]
          .findIndex(column => column.id === id);

        newState[RETRO_COLUMNS_KEY].splice(indexToRemove, 1);

        return newState;
      }
    },
    COLUMN_REMOVE_FAILURE
  ], COLUMN_REMOVE_QUERY_KEY),
  ...handleQuery([
    COLUMN_EDIT_IN_PROGRESS,
    {
      [COLUMN_EDIT_SUCCESS](state, payload) {
        const newState = deepClone(state);
        const { id } = payload;
        const indexToUpdate = newState[RETRO_COLUMNS_KEY]
          .find(column => column.id === id);

        newState[RETRO_COLUMNS_KEY][indexToUpdate] = payload;

        return newState;
      }
    },
    COLUMN_EDIT_FAILURE
  ], COLUMN_EDIT_QUERY_KEY),
  ...handleQuery([
    CARD_ADD_IN_PROGRESS,
    {
      [CARD_ADD_SUCCESS](state, payload) {
        const newState = deepClone(state);
        newState[RETRO_CARDS_KEY].push(payload);

        return newState;
      }
    },
    CARD_ADD_FAILURE
  ], CARD_ADD_QUERY_KEY),
  ...handleQuery([
    CARD_REMOVE_IN_PROGRESS,
    {
      [CARD_REMOVE_SUCCESS](state, payload) {
        const newState = deepClone(state);
        const { id } = payload;
        const indexToRemove = newState[RETRO_CARDS_KEY]
          .findIndex(column => column.id === id);

        newState[RETRO_CARDS_KEY].splice(indexToRemove, 1);

        return newState;
      }
    },
    CARD_REMOVE_FAILURE
  ], CARD_REMOVE_QUERY_KEY),
  ...handleQuery([
    CARD_EDIT_IN_PROGRESS,
    {
      [CARD_EDIT_SUCCESS](state, payload) {
        const newState = deepClone(state);
        const { id } = payload;
        const cardToUpdate = newState[RETRO_CARDS_KEY]
          .find(column => column.id === id);

        if (cardToUpdate) {
          Object.assign(cardToUpdate, payload);
        }

        return newState;
      }
    },
    CARD_EDIT_FAILURE
  ], CARD_EDIT_QUERY_KEY)
};

export const retroReducer = (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};

export default retroReducer;
