import { wideCardWidth } from '../../theme/dimensions';

const styles = theme => ({
  root: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.unit * 2
  },
  card: {
    padding: theme.spacing.unit,
    width: wideCardWidth,
    maxWidth: '100%',
    margin: '0 auto',
    overflow: 'hidden'
  }
});

export default styles;
