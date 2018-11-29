import * as React from 'react';

import { Button, Checkbox, createStyles, withStyles, WithStyles } from '@material-ui/core';

import { displayName } from './SensorTitles';

import FilterIcon from '@material-ui/icons/FilterList';

interface Props extends WithStyles<typeof styles> {
  sensors: string[],
  onChange: (enabled: Set<string>) => void,
  active: Set<string>,
}

const styles = createStyles({
  button: {
    margin: 3
  },
  inner: {
    padding: "0px 8px",
  },
  checkbox: {
    padding: 6,
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
  }
});

class SensorSelector extends React.Component<Props> {

  public constructor(props: Props) {
    super(props);
  }

  public render() {
    return <div className={this.props.classes.flex}>
      <FilterIcon />
      {this.props.sensors.map(sensor => (
        <Button
          key={sensor}
          onClick={this.handleToggle(sensor)}
          variant="outlined"
          className={this.props.classes.button}
          classes={{ root: this.props.classes.inner }}
        >
          <Checkbox
            disableRipple
            checked={this.props.active.has(sensor)}
            classes={{ root: this.props.classes.checkbox }}
          />
          {displayName(sensor)}
        </Button>
      ))}
    </div>;
  }

  private handleToggle = (sensor: string) => () => {

    const newActive = new Set(this.props.active);

    if (newActive.has(sensor)) {
      newActive.delete(sensor);
    } else {
      newActive.add(sensor);
    }

    this.props.onChange(newActive);
  };


}

export default withStyles(styles)(SensorSelector);
