const styles = theme => ({
  appBar: {
    width: '100%',
    backgroundColor: theme.palette.dark
  },
  appLogo: {
    height: '30px'
  },
  Toolbar: {
    color: '#fff',
    fontFamily: 'arial',
    fontWeight: 700,
    letterSpacing: 0.5
  },
  actionButtons: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
    color: '#6f7a88'
  },
  headline: {
    padding: `0 ${2 * theme.spacing.unit}px`
  }
});

export default styles;
