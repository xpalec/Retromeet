import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton, TextField, Typography } from 'material-ui';
import { FormattedMessage } from 'react-intl';
import AddIcon from 'material-ui-icons/Add';
import Card from '../../containers/Retro/Card';
import { QUERY_ERROR_KEY, queryFailed, QueryShape } from '../../services/websocket/query';
import { submitOnEnter } from '../../services/events/submitOnEnter';

class Column extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  componentWillReceiveProps(nextProps) {
    const { addCardQuery, addMessage } = this.props;
    const { addCardQuery: nextAddCardQuery } = nextProps;
    if (queryFailed(addCardQuery, nextAddCardQuery)) {
      addMessage(nextAddCardQuery[QUERY_ERROR_KEY]);
    }
  }

  addCard = () => {
    const { socket } = this.context;
    const { text } = this.state;
    const { column: { id }, addCard } = this.props;
    if (!text.length) return;
    addCard(socket, id, text);
    this.setState({ text: '' });
  };

  handleTextChange = (e) => {
    this.setState({ text: e.target.value });
  };

  render() {
    const { column, cards, classes } = this.props;
    const { text } = this.state;

    return (
      <div className={classes.column}>
        <Typography type="headline">{column.name}</Typography>
        <div className={classes.addCardContainer}>
          <TextField
            multiline
            className={`${classes.newColumnName} ${classes.horizontalMargins}`}
            autoFocus
            margin="dense"
            onChange={this.handleTextChange}
            label={<FormattedMessage id="retro.add-card-label" />}
            fullWidth
            value={text}
            onKeyPress={submitOnEnter(this.addCard)}
          />
          <IconButton disabled={!text} onClick={this.addCard}>
            <AddIcon />
          </IconButton>
        </div>
        {cards.filter(card => column.id === card.columnId).map(card => (
          <Card card={card} key={card.id} />
        ))}
      </div>
    );
  }
}

Column.contextTypes = {
  socket: PropTypes.object.isRequired
};

Column.propTypes = {
  // Values
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  cards: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    columnId: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  })).isRequired,
  // Functions
  addCard: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  // Queries
  addCardQuery: PropTypes.shape(QueryShape).isRequired,
  // Styles
  classes: PropTypes.shape({
    column: PropTypes.string.isRequired,
    addCardContainer: PropTypes.string.isRequired
  }).isRequired
};

export default Column;
