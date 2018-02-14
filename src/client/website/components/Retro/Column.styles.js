const styles = theme => ({
  column: {
    display: 'flex',
    flex: '1 0 auto',
    flexFlow: 'column',
    alignContent: 'center',
    minWidth: 300,
    maxWidth: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    margin: theme.spacing.unit,
    borderRadius: 3,
    padding: theme.spacing.unit
  },
  addCardContainer: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'flex-end',
    paddingBottom: theme.spacing.unit
  }
});

export default styles;
