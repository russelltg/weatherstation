import * as React from 'react';
import * as WebRequest from "web-request";
import SensorGraph from './SensorGraph';
import SensorSelector from './SensorSelector';
import { createStyles, WithStyles, withStyles } from '@material-ui/core';

interface State {
  sensors: string[],
  active_sensors: Set<string>,
}

const styles = createStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  }
});

type Props = WithStyles<typeof styles>;

class SensorGrid extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      sensors: [],
      active_sensors: new Set<string>(),
    }
    this.fetchSensors();
  }

  public render() {
    return <>
      <SensorSelector sensors={this.state.sensors} onChange={this.onActiveChanged} />
      <div className={this.props.classes.container}>
        {this.state.sensors.map(val => {
          if (this.state.active_sensors.has(val)) {
            return <SensorGraph key={val} sensor={val} />;
          } else {
            return <div key={val} />;
          }
        })}
      </div>
    </>;
  }

  private async fetchSensors() {
    const sensorList = await WebRequest.json<string[]>(
      `${window.location.origin}/sensors`);

    this.setState({
      sensors: sensorList,
      active_sensors: new Set<string>(sensorList),
    });
  }

  private onActiveChanged = (active: Set<string>) => {
    this.setState({
      active_sensors: active,
    });
  };
}

export default withStyles(styles)(SensorGrid);
