import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { IconButton, Typography, Toolbar, AppBar } from 'material-ui';
import PersonIcon from 'material-ui-icons/Person';
import LanguageButton from '../../../containers/LanguageButton';
import { HOMEPAGE_ROUTE_PATH } from '../../../routes/Homepage/MainRoutes';

const Header = ({
  classes,
  headline,
  openChangeNameDialog,
  children
}) => (
  <header>
    <AppBar
      className={classes.appBar}
      position="static"
      color="default"
    >
      <Toolbar>
        <Link to={HOMEPAGE_ROUTE_PATH}>
          <span className="logotype">RETROMEET</span>
        </Link>
        <Typography type="headline" className={classes.headline}>
          {headline}
        </Typography>
        <div className={classes.actionButtons}>
          {children}
          <IconButton onClick={openChangeNameDialog}>
            <PersonIcon />
          </IconButton>
          <LanguageButton />
        </div>
      </Toolbar>
    </AppBar>
  </header>
);

Header.defaultProps = {
  headline: ''
};

Header.propTypes = {
  // Values
  headline: PropTypes.string,
  children: PropTypes.node.isRequired,
  openChangeNameDialog: PropTypes.func.isRequired,
  // Styles
  classes: PropTypes.shape({
    appBar: PropTypes.string.isRequired,
    actionButtons: PropTypes.string.isRequired,
    appLogo: PropTypes.string.isRequired,
    headline: PropTypes.string.isRequired
  }).isRequired
};

export default Header;
