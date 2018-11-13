import * as React from 'react';
import * as WebRequest from "web-request";
import SensorGraph from './SensorGraph';

interface State {
    sensors: string[]
}

class SensorGrid extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props)

        this.state = {
            sensors: []
        }
        this.fetchSensors();
    }

    private async fetchSensors() {
        const sensorList = await WebRequest.json<string[]>(
            `${window.location.origin}/sensors`);

        this.setState({ sensors: sensorList });
    }

    public render() {
        //return <>{this.state.sensors.map(val => (<SensorGraph sensor={val} />))}</>;
        return <></>;
    }
}

export default SensorGrid;
