import cardActions from './card/card.actions';
import cardHandlers from './card/card.handlers';

import columnActions from './column/column.actions';
import columnHandlers from './column/column.handlers';

import retroActions from './retro/retro.actions';
import retroHandlers from './retro/retro.handlers';

import userActions from './user/user.actions';
import userHandlers from './user/user.handlers';

const handlers = {
  ...cardHandlers,
  ...columnHandlers,
  ...retroHandlers,
  ...userHandlers
};

const actions = {
  ...cardActions,
  ...columnActions,
  ...retroActions,
  ...userActions
};

export {
  handlers,
  actions
};
