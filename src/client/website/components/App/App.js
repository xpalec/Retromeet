import React from 'react';
import PropTypes from 'prop-types';
import Header from './../../containers/App/Header';
import Footer from './../../containers/App/Footer';

const App = ({
  children,
  headerChildren,
  dialogChildren,
  classes
}) => (
  <div className={classes.app}>
    <Header>
      {headerChildren}
    </Header>
    <section className={classes.content}>{children}</section>
    <Footer />
    {dialogChildren}
  </div>
);

App.defaultProps = {
  headerChildren: [],
  dialogChildren: []
};

App.propTypes = {
  classes: PropTypes.shape({
    app: PropTypes.string.isRequired
  }).isRequired,
  children: PropTypes.node.isRequired,
  headerChildren: PropTypes.node,
  dialogChildren: PropTypes.node
};

App.contextTypes = {
  socket: PropTypes.object.isRequired
};

export default App;
