import theme from '../../theme';

const styles = () => ({
  '@global': {
    body: {
      padding: '0',
      margin: '0'
    },
    a: {
      color: 'inherit',
      textDecoration: 'none'
    },
    '*': {
      boxSizing: 'border-box'
    }
  },
  flex: {
    flex: '1'
  },
  app: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    margin: '0',
    padding: '0',
    width: '100%',
    minHeight: '100%',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    textAlign: 'center',
    background: `linear-gradient(to right bottom, ${theme.palette.primary[500]} 0%, ${theme.palette.secondary[500]} 100%)`
  },
  content: {
    flex: '1 0 100%',
    display: 'flex'
  }
});

export default styles;
