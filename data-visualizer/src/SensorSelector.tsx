import * as React from 'react';

import { Button, Checkbox, createStyles, Dialog, DialogTitle, List, ListItem, ListItemText, withStyles, WithStyles, DialogContent, DialogActions, Typography } from '@material-ui/core';

import FilterIcon from '@material-ui/icons/FilterList';


interface Props extends WithStyles<typeof styles> {
  sensors: string[],
  onChange: (enabled: Set<string>) => void,
}

interface State {
  active: Set<string>;
  dialogOpen: boolean,
}

const styles = createStyles({
  button: {
    margin: 5
  }
});

class SensorSelector extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);

    this.state = {
      active: new Set<string>(props.sensors),
      dialogOpen: false,
    };
  }

  public render() {
    return <>
      <Button variant="outlined" color="primary" className={this.props.classes.button} onClick={this.openDialog}>
        Filter Sensors
                <FilterIcon />
      </Button>
      <Dialog open={this.state.dialogOpen}>
        <DialogTitle>Filter Sensors...</DialogTitle>
        <DialogContent>
          <List>
            {this.props.sensors.map(sensor => (
              <ListItem key={sensor} button onClick={this.handleToggle(sensor)}>
                <Checkbox checked={this.state.active.has(sensor)} disableRipple />
                <ListItemText primary={sensor} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeDialog}>
            <Typography color="secondary">Apply</Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </>;
  }

  private handleToggle = (sensor: string) => () => {

    const newActive = new Set(this.state.active);

    if (this.state.active.has(sensor)) {
      newActive.delete(sensor);
    } else {
      newActive.add(sensor);
    }

    this.setState({
      active: newActive
    });
  };

  private closeDialog = () => {
    this.setState({
      dialogOpen: false,
    });
    this.props.onChange(this.state.active);
  };

  private openDialog = () => {
    this.setState({
      dialogOpen: true,
    });
  }

}

export default withStyles(styles)(SensorSelector);
