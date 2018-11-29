import * as React from 'react';
import { SensorReading } from './SensorData';
import { Typography, Card, CardContent, WithStyles, withStyles } from '@material-ui/core';
import { displayName, units } from './SensorTitles';

// format:
// {
//     "station1": {
//         "sensor1": 2.0
//     }
// }
interface State {
  [key: string]: {
    [key: string]: number
  }
}

const styles = {
  flex: {
    display: "flex"
  }
}

type Props = WithStyles<typeof styles>;

class CurrentReadings extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {};

    const ws = new WebSocket(`ws://${window.location.hostname}:${window.location.port}/ws`)
    ws.onmessage = event => {
      const datapoint = JSON.parse(event.data) as SensorReading;

      const station = datapoint.station in this.state ? this.state[datapoint.station] : {};
      station[datapoint.sensor] = datapoint.reading;

      const partialState = {};
      partialState[datapoint.station] = station;
      this.setState(partialState);
    }

  }

  public render() {
    return <div className={this.props.classes.flex}>
      {Object.keys(this.state).map(station => (<Card key={station}>
        <CardContent>
          <Typography variant="h2">{station}</Typography>
          {Object.keys(this.state[station]).map(sensor => (
            <div>{displayName(sensor)}: {this.state[station][sensor]} {units(sensor)}</div>
          ))}
        </CardContent>
      </Card>))}
    </div>;
  }

}

export default withStyles(styles)(CurrentReadings);
