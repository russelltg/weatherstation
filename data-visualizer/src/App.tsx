import * as React from 'react';

import SensorGrid from './SensorGrid';

import { AppBar, Toolbar, Typography, WithStyles, createStyles, withStyles } from '@material-ui/core';

import SettingsDialog from './SettingsDialog';
import CurrentReadings from './CurrentReadings';


const styles = createStyles({
  grow: {
    flexGrow: 1,
  },
  body: {
    margin: 10,
  }
});

class App extends React.Component<WithStyles<typeof styles>, {}> {
  public constructor(props: WithStyles<typeof styles>) {
    super(props);
  }

  public render() {
    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography className={this.props.classes.grow} variant="h6" color="inherit">Weather Station</Typography>
            <SettingsDialog />
          </Toolbar>
        </AppBar>
        <div className={this.props.classes.body}>
          <CurrentReadings />
          <SensorGrid />
        </div>
      </div >
    );
  }
}

export default withStyles(styles)(App);
