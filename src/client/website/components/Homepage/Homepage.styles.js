import { logoHeight, cardWidth } from '../../theme/dimensions';

const styles = theme => ({
  root: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2 * theme.spacing.unit,
    maxWidth: cardWidth
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row'
  },
  button: {
    textDecoration: 'none',
    margin: 2 * theme.spacing.unit
  },
  bigLogo: {
    height: logoHeight
  }
});

export default styles;
