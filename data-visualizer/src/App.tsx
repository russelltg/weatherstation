import * as React from 'react';

import SensorGrid from './SensorGrid';

import { AppBar, IconButton, Toolbar, Typography, WithStyles, createStyles, withStyles } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import SettingsDialog from './SettingsDialog';


const styles = createStyles({
  grow: {
    flexGrow: 1,
  }
});

class App extends React.Component<WithStyles<typeof styles>, {}> {
  public constructor(props: WithStyles<typeof styles>) {
    super(props);
  }

  public render() {
    return (
      <div className="App">
        <AppBar position="static" color="default">
          <Toolbar>
            <IconButton color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography className={this.props.classes.grow} variant="h6" color="inherit">Weather Station</Typography>
            <SettingsDialog />
          </Toolbar>
        </AppBar>
        <SensorGrid />
      </div >
    );
  }
}

export default withStyles(styles)(App);
