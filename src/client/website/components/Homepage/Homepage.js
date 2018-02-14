import React from 'react';
import { Button, Card } from 'material-ui';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import logo from '../../../images/logo.svg';
import { JOIN_RETRO_ROUTE_PATH } from '../../routes/JoinRetro/MainRoutes';
import { NEW_RETRO_ROUTE_PATH } from '../../routes/NewRetro/MainRoutes';
import MultilineFormattedMessage from '../../i18n/MultilineFormattedMessage';

const Homepage = ({ classes }) => (
  <div className={classes.root}>
    <Card className={classes.card}>
      <img src={logo} className={classes.bigLogo} alt="logo" />
      <p>
        <MultilineFormattedMessage id="homepage.message" multiline />
      </p>
      <div className={classes.buttons}>
        <Button
          focusRipple
          color="primary"
          className={classes.button}
          component={Link}
          to={NEW_RETRO_ROUTE_PATH}
        >
          <FormattedMessage id="homepage.start-retro" />
        </Button>
        <Button
          focusRipple
          color="primary"
          className={classes.button}
          component={Link}
          to={JOIN_RETRO_ROUTE_PATH}
        >
          <FormattedMessage id="homepage.join" />
        </Button>
      </div>
    </Card>
  </div>
);

Homepage.defaultProps = {};

Homepage.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    card: PropTypes.string.isRequired,
    buttons: PropTypes.string.isRequired,
    button: PropTypes.string.isRequired
  }).isRequired
};

export default Homepage;
