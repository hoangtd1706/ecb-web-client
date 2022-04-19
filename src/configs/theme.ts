import { createMuiTheme } from '@material-ui/core/styles';

const defaultTheme = createMuiTheme();

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#056341',
    },
  },
  mixins: {
    toolbar: {
      height: '48px',
    },
  },
  overrides: {
    MuiListItemIcon: {
      root: {
        minWidth: '40px',
      },
    },
    MuiListItemText: {
      primary: {
        height: '20px',
        fontWeight: 400,
      },
      secondary: {
        height: '20px',
        fontWeight: 'bold',
      },
    },
    MuiPaper: {
      rounded: {
        [defaultTheme.breakpoints.down('xs')]: {
          borderRadius: 0,
          border: 'none',
        },
      },
    },
  },
});

export default theme;
