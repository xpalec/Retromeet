import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './../../components/Retro/Card.styles';
import Card from '../../components/Retro/Card';
import {
  CARD_EDIT_QUERY_KEY,
  CARD_REMOVE_QUERY_KEY,
  COLUMN_EDIT_QUERY_KEY, RETRO_USERS_KEY
} from '../../reducers/retro';
import { cardEdit, cardRemove } from '../../actions/card';
import { USER_ID_KEY } from '../../reducers/user';
import { addMessage } from '../../actions/layout';

const mapStateToProps = ({ retro, user }) => ({
  userId: user[USER_ID_KEY],
  users: retro[RETRO_USERS_KEY],
  editColumnQuery: retro[COLUMN_EDIT_QUERY_KEY],
  editCardQuery: retro[CARD_EDIT_QUERY_KEY],
  removeCardQuery: retro[CARD_REMOVE_QUERY_KEY]
});

const mapDispatchToProps = dispatch => ({
  editCard: (socket, card) => dispatch(cardEdit(socket, card)),
  removeCard: (socket, cardId) => dispatch(cardRemove(socket, cardId)),
  addMessage: message => dispatch(addMessage(message))
});

export default withRouter(withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Card)
));
