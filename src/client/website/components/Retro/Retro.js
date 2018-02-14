import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardActions,
  CardContent,
  Step,
  StepLabel,
  Stepper,
  Tooltip,
  Typography
} from 'material-ui';
import { CircularProgress } from 'material-ui/Progress';
import {
  QUERY_ERROR_KEY,
  QUERY_STATUS_FAILURE,
  QUERY_STATUS_KEY,
  QUERY_STATUS_SUCCESS,
  queryFailed,
  QueryShape,
  querySucceeded
} from '../../services/websocket/query';
import Column from '../../containers/Retro/Column';
import { initialsOf } from '../../services/utils/initials';

const stages = [
  { key: 'write', label: 'Write your thoughts' },
  { key: 'vote', label: 'Vote on most important issues' },
  { key: 'take-actions', label: 'Decide on actions' },
  { key: 'closed', label: 'Close the meeting' }
];

class Retro extends Component {
  componentWillMount() {
    this.joinRetro();
  }

  componentWillReceiveProps(nextProps) {
    const { addColumnQuery, connectQuery, addMessage } = this.props;
    const { addColumnQuery: nextAddColumnQuery, connectQuery: nextConnectQuery } = nextProps;
    if (queryFailed(addColumnQuery, nextAddColumnQuery)) {
      addMessage(nextAddColumnQuery[QUERY_ERROR_KEY]);
    }
    if (querySucceeded(connectQuery, nextConnectQuery)) {
      this.joinRetro();
    }
  }

  joinRetro = () => {
    const { joinRetro, match: { params: { retroShareId } } } = this.props;
    const { socket } = this.context;
    joinRetro(socket, retroShareId);
  };

  render() {
    const {
      classes,
      columns,
      users,
      userId,
      scrumMasterId,
      history,
      stage,
      connectedUsers,
      joinRetroQuery: {
        [QUERY_STATUS_KEY]: joinStatus,
        [QUERY_ERROR_KEY]: joinError
      }
    } = this.props;
    switch (joinStatus) {
      case QUERY_STATUS_SUCCESS:
        return (
          <div className={classes.root}>
            {userId === scrumMasterId && userId && (
              <Card className={classes.scrumMasterPanel}>
                <Stepper activeStep={stages.findIndex(s => s.key === stage)} alternativeLabel>
                  {stages.map(({ key, label }) => (
                    <Step key={key}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Card>
            )}
            <div className={classes.columns}>
              {columns.map(column => (
                <Column key={column.id} column={column} />
              ))}
            </div>
            <div className={classes.users}>
              {connectedUsers.map(({ id, connections }) => (
                <Tooltip key={id} title={users[id].name} placement="left">
                  <Badge
                    classes={{
                      root: classes.badge,
                      badge: connections === 1 && classes.hidden
                    }}
                    badgeContent={connections}
                    color="primary"
                  >
                    <Avatar
                      alt={users[id].name}
                      className={classes.avatar}
                    >
                      {initialsOf(users[id].name)}
                    </Avatar>
                  </Badge>
                </Tooltip>
              ))}
            </div>
          </div>
        );
      case QUERY_STATUS_FAILURE:
        return (
          <div className={classes.root}>
            <Card className={classes.messageCard}>
              <Typography type="headline">Error</Typography>
              <CardContent>
                <Typography>{joinError}</Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => history.goBack()}>Back</Button>
              </CardActions>
            </Card>
          </div>
        );
      default:
        return (
          <div className={classes.root}>
            <Card className={classes.messageCard}>
              <CircularProgress color="primary" />
            </Card>
          </div>
        );
    }
  }
}

Retro.defaultProps = {
  userId: undefined,
  scrumMasterId: undefined,
  stage: undefined
};

Retro.contextTypes = {
  socket: PropTypes.object.isRequired
};

Retro.propTypes = {
  // Values
  userId: PropTypes.string,
  scrumMasterId: PropTypes.string,
  history: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      retroShareId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  stage: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
  })).isRequired,
  users: PropTypes.object.isRequired,
  connectedUsers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    connections: PropTypes.number.isRequired
  })).isRequired,
  // Queries
  connectQuery: PropTypes.shape(QueryShape).isRequired,
  joinRetroQuery: PropTypes.shape(QueryShape).isRequired,
  addColumnQuery: PropTypes.shape(QueryShape).isRequired,
  // Functions
  joinRetro: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  // Styles
  classes: PropTypes.shape({
    avatar: PropTypes.string.isRequired,
    root: PropTypes.string.isRequired,
    messageCard: PropTypes.string.isRequired,
    columns: PropTypes.string.isRequired,
    users: PropTypes.string.isRequired,
    hidden: PropTypes.string.isRequired
  }).isRequired
};

export default Retro;
