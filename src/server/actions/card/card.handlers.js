import mongoose from 'mongoose';
import Retro from '../../models/retro.model';
import { ACTION_CARD_ADD, ACTION_CARD_EDIT, ACTION_CARD_REMOVE } from './card.actions';
import { getId, getIds } from '../../utils';

export default {
  [ACTION_CARD_ADD]: async (params, state) => {
    const { retroId, userId } = state;
    const { text, columnId } = params;
    const retro = await Retro.findById(retroId);
    if (!retro || !retro.participates(userId)) {
      throw new Error('You are not participating in a retrospective.');
    }
    if (!text) throw new Error('Card text must not be empty.');
    const column = retro.columns.find(c => getId(c) === columnId);
    if (!column) throw new Error('Column incorrect or not selected.');
    const card = {
      _id: new mongoose.Types.ObjectId(),
      columnId,
      text,
      authors: [userId],
      votes: [userId]
    };

    const updated = await Retro.findOneAndUpdate(
      { _id: retroId },
      { $push: { cards: card } },
      { new: true }
    ).exec();
    if (!updated) {
      throw new Error('Couldn\'t add a card.');
    }

    return {
      broadcast: {
        ...card,
        _id: undefined,
        id: getId(card._id)
      }
    };
  },
  [ACTION_CARD_EDIT]: async (params, state) => {
    const { retroId, userId } = state;
    const { text, id } = params;
    const retro = await Retro.findById(retroId);
    if (!retro.participates(userId)) {
      throw new Error('You are not participating in a retrospective.');
    }
    const updated = await Retro.findOneAndUpdate({
      _id: retroId,
      cards: { $elemMatch: { _id: id, authors: userId } }
    }, {
      'cards.$.text': text
    }, {
      new: true,
      projection: { cards: { $elemMatch: { _id: id } } }
    }).exec();
    if (!updated) {
      throw new Error('Card not updated because it doesn\'t exist or you don\'t have sufficient privileges.');
    }
    const card = updated.cards[0];
    return {
      broadcast: {
        id,
        text: card.text,
        authors: getIds(card.authors),
        votes: getIds(card.votes)
      }
    };
  },
  [ACTION_CARD_REMOVE]: async (params, state) => {
    const { retroId, userId } = state;
    const { id } = params;
    const retro = await Retro.findById(retroId);
    if (!retro.participates(userId)) {
      throw new Error('You are not participating in a retrospective.');
    }

    const updated = await Retro.findOneAndUpdate({
      _id: retroId,
      cards: { $elemMatch: { _id: id, authors: userId } }
    }, {
      $pull: { cards: { _id: id } }
    }, {
      new: true
    }).exec();

    if (!updated) {
      throw new Error('Card not removed because it doesn\'t exist or you don\'t have sufficient privileges.');
    }

    return {
      broadcast: {
        id
      }
    };
  }
};
