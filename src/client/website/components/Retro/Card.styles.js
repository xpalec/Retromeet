const styles = theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '240px',
    width: '80%',
    maxWidth: '400px',
    alignSelf: 'center',
    padding: theme.spacing.unit,
    margin: `${theme.spacing.unit / 2}px 0`
  },
  expander: {
    flexGrow: 1
  },
  text: {
    paddingBottom: theme.spacing.unit,
    whiteSpace: 'pre'
  },
  author: {
    height: 24,
    fontSize: '0.8rem'
  },
  authorAvatar: {
    width: 24,
    height: 24,
    fontSize: '0.8rem'
  },
  action: {
    width: 24,
    height: 24
  },
  actionIcon: {
    width: 16,
    height: 16
  }
});

export default styles;
