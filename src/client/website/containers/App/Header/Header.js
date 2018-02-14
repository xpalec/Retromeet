import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';
import styles from './../../../components/App/Header/Header.styles';
import Header from './../../../components/App/Header';
import { openChangeNameDialog } from '../../../actions/layout';
import { USER_NAME_KEY } from '../../../reducers/user';
import { RETRO_NAME_KEY } from '../../../reducers/retro';

const mapStateToProps = ({ user, retro }) => ({
  userName: user[USER_NAME_KEY],
  headline: retro[RETRO_NAME_KEY]
});

const mapDispatchToProps = dispatch => ({
  openChangeNameDialog: () => dispatch(openChangeNameDialog(true))
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Header)
);
