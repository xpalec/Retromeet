import { wideCardWidth } from '../../theme/dimensions';

const styles = theme => ({
  root: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.unit * 2
  },
  listItem: {
    textAlign: 'left'
  },
  card: {
    width: wideCardWidth,
    maxWidth: '100%',
    margin: '0 auto',
    overflow: 'hidden'
  },
  row: {
    display: 'flex',
    flexFlow: 'row nowrap'
  },
  horizontalMargins: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  newColumnContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center'
  },
  newColumnIconContainer: {
    flex: '0 0 128px'
  },
  newColumnIcon: {
    width: 16,
    height: 16
  },
  newColumnIconSelect: {
    display: 'flex',
    flexFlow: 'row nowrap'
  },
  newColumnNameInput: {
    flex: '1'
  },
  cardContent: {
    padding: theme.spacing.unit * 2
  },
  headline: {
    paddingBottom: theme.spacing.unit * 2
  },
  progress: {
    display: 'absolute',
    margin: 'auto'
  },
  hidden: {
    opacity: '0',
    pointerEvents: 'none'
  }
});

export default styles;
