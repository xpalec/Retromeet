import Retro from '../../models/retro.model';
import User from '../../models/user.model';
import { getId, isValidId, toMongoId, urlSafeBase64ToHex } from '../../utils';
import {
  ACTION_RETRO, ACTION_RETRO_JOIN, ACTION_RETRO_LEAVE, ACTION_RETRO_NEW,
  ACTION_RETRO_RENAME
} from './retro.actions';
import logger from '../../logger';

export default {
  [ACTION_RETRO_NEW]: async (params, state, perform) => {
    const { name } = params;
    const { retroId, userId } = state;
    if (retroId) {
      Object.assign(state, await perform(ACTION_RETRO_LEAVE, { retroId }));
    }
    const retro = await new Retro({
      name,
      users: [{ user: userId }],
      scrumMaster: userId
    }).save();
    const newRetroId = getId(retro);
    await perform(ACTION_RETRO, { retroId: newRetroId });
    return {
      emit: {},
      join: newRetroId,
      state: { retroId: newRetroId }
    };
  },
  [ACTION_RETRO_RENAME]: async (params, state) => {
    const { name } = params;
    const { retroId, userId } = state;
    const retro = await Retro.findById(retroId);
    if (!retro.participates(userId)) {
      throw new Error('You are not participating in a retrospective.');
    }
    if (!retro.isScrumMaster(userId)) {
      throw new Error('Only a scrum master can rename a retrospective.');
    }
    const updated = await Retro.findByIdAndUpdate(retroId, {
      name
    }, {
      new: true
    });
    if (!updated) {
      throw new Error('Couldn\'t update retrospective name.');
    }
    return {
      broadcast: { name }
    };
  },
  [ACTION_RETRO_JOIN]: async (params, state, perform) => {
    const { id } = params;
    const { userId, retroId } = state;
    if (!userId) throw new Error('Missing user identifier');
    if (retroId) {
      Object.assign(state, await perform(ACTION_RETRO_LEAVE, { retroId }));
    }

    const newRetroId = urlSafeBase64ToHex(id);
    if (!isValidId(newRetroId)) {
      throw new Error('Passed retrospective identifier has incorrect format.');
    }

    const addedUser = await Retro.findOneAndUpdate({
      _id: newRetroId,
      'users.user': { $ne: toMongoId(userId) }
    }, {
      $push: { users: { user: userId } }
    }, { new: true });
    const connectedUser = await Retro.findOneAndUpdate({
      _id: newRetroId,
      'users.user': toMongoId(userId)
    }, {
      $inc: { 'users.$.connections': 1 }
    }, { new: true });

    if (!addedUser && !connectedUser) {
      throw new Error('Couldn\'t join the retrospective.');
    }

    const retro = await Retro.findById(newRetroId).populate('users.user');
    const user = await User.findById(userId);

    await perform(ACTION_RETRO, { retroId: newRetroId });

    return {
      join: newRetroId,
      broadcast: {
        userJoined: {
          id: userId,
          connections: retro.users.find(u => getId(u.user) === userId).connections,
          name: user.name
        }
      },
      state: { retroId: newRetroId }
    };
  },
  [ACTION_RETRO_LEAVE]: async (params, state) => {
    const { retroId } = params;
    const { userId } = state;
    const disconnectedUser = await Retro.findOneAndUpdate({
      _id: retroId,
      users: { $elemMatch: { user: toMongoId(userId), connections: { $gte: 1 } } }
    }, {
      $inc: { 'users.$.connections': -1 }
    }, { new: true });
    if (!disconnectedUser) {
      logger.error(new Error('Attempted to disconnected User from retro he did not belong to.'));
      return {};
    }
    return {
      broadcast: {
        userLeft: {
          id: userId,
          connections: disconnectedUser.users.find(u => getId(u.user) === userId).connections
        }
      },
      leave: retroId
    };
  },
  [ACTION_RETRO]: async (params) => {
    const { retroId } = params;
    const retro = await Retro.findById(retroId).populate('users.user');
    return {
      emit: retro.toJSON()
    };
  }
};
