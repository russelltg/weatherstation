import * as React from 'react';

import SensorGrid from './SensorGrid';

import { AppBar, IconButton, Toolbar, Typography, WithStyles, createStyles, withStyles } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import SettingsIcon from '@material-ui/icons/Settings';
import SettingsDialog from './SettingsDialog';

interface State {
  settingsOpen: boolean,
}

const styles = createStyles({
  grow: {
    flexGrow: 1,
  }
});

class App extends React.Component<WithStyles<typeof styles>, State> {
  public constructor(props: WithStyles<typeof styles>) {
    super(props);

    this.state = {
      settingsOpen: false,
    };
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
            <IconButton onClick={this.openSettings}><SettingsIcon /></IconButton>
          </Toolbar>
        </AppBar>
        <SensorGrid />
        <SettingsDialog open={this.state.settingsOpen} />
      </div >
    );
  }

  private openSettings = () => {
    this.setState({
      settingsOpen: true,
    })
  };
}

export default withStyles(styles)(App);
