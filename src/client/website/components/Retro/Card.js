import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card as MaterialCard,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  ClickAwayListener,
  IconButton,
  TextField,
  Typography
} from 'material-ui';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import { initialsOf } from '../../services/utils/initials';
import {
  QUERY_ERROR_KEY,
  QUERY_STATUS_IN_PROGRESS,
  QUERY_STATUS_KEY,
  queryFailed,
  QueryShape,
  querySucceeded
} from '../../services/websocket/query';
import { submitOnEnter } from '../../services/events/submitOnEnter';

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = { isEditing: false, text: undefined };
  }

  componentWillReceiveProps(nextProps) {
    const { editCardQuery, removeCardQuery, addMessage } = this.props;
    const { editCardQuery: nextEditCardQuery, removeCardQuery: nextRemoveCardQuery } = nextProps;

    if (queryFailed(editCardQuery, nextEditCardQuery)) {
      addMessage(nextEditCardQuery[QUERY_ERROR_KEY]);
    } else if (querySucceeded(editCardQuery, nextEditCardQuery)) {
      this.setState({ isEditing: false, text: undefined });
    }
    if (queryFailed(removeCardQuery, nextRemoveCardQuery)) {
      addMessage(nextRemoveCardQuery[QUERY_ERROR_KEY]);
    }
  }

  handleTextChange = (e) => {
    this.setState({ text: e.target.value });
  };

  startEditing = () => {
    const { card: { text } } = this.props;
    this.setState({ isEditing: true, text });
  };

  editCard = () => {
    const { socket } = this.context;
    const { text } = this.state;
    const { editCard, card: { id } } = this.props;
    if (!text.length) return;
    editCard(socket, { id, text });
  };

  render() {
    const { userId, card, users, classes, removeCard, editCardQuery } = this.props;
    const { isEditing, text } = this.state;
    const { socket } = this.context;
    const inProgress = editCardQuery[QUERY_STATUS_KEY] === QUERY_STATUS_IN_PROGRESS;
    return (
      <MaterialCard className={classes.card}>
        {inProgress ? (
          <CircularProgress />
        ) : [
          <CardContent key="content">
            {isEditing ? (
              <ClickAwayListener onClickAway={this.editCard}>
                <TextField
                  multiline
                  autoFocus
                  margin="dense"
                  onChange={this.handleTextChange}
                  label="What's on your mind?"
                  fullWidth
                  value={text}
                  onKeyPress={submitOnEnter(this.editCard)}
                />
              </ClickAwayListener>
            ) : (
              <Typography align="left" className={classes.text}>
                {card.text}
              </Typography>
            )}
          </CardContent>,
          <CardActions key="actions">
            {card.authors.map(authorId => (
              <Chip
                key={authorId}
                className={classes.author}
                label={users[authorId].name}
                avatar={
                  <Avatar className={classes.authorAvatar}>
                    {initialsOf(users[authorId].name)}
                  </Avatar>
                }
              />
            ))}
            <div className={classes.expander} />
            {(!isEditing && card.authors.indexOf(userId) >= 0) && [
              <IconButton key="edit" className={classes.action} onClick={this.startEditing}>
                <EditIcon className={classes.actionIcon} />
              </IconButton>,
              <IconButton key="delete" className={classes.action} onClick={() => removeCard(socket, card.id)}>
                <DeleteIcon className={classes.actionIcon} />
              </IconButton>
            ]}
          </CardActions>
        ]}
      </MaterialCard>
    );
  }
}

Card.contextTypes = {
  socket: PropTypes.object.isRequired
};

Card.propTypes = {
  // Values
  userId: PropTypes.string.isRequired,
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    authors: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  users: PropTypes.objectOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  // Functions
  editCard: PropTypes.func.isRequired,
  removeCard: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  // Queries
  removeCardQuery: PropTypes.shape(QueryShape).isRequired,
  editCardQuery: PropTypes.shape(QueryShape).isRequired,
  // Styles
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    expander: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    authorAvatar: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    actionIcon: PropTypes.string.isRequired
  }).isRequired
};

export default Card;
