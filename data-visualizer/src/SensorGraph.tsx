import { Chart, ChartPoint } from 'chart.js';
import * as React from 'react';
import * as WebRequest from "web-request";
import { SensorReading } from './SensorData';
import './SensorTitles';
import { units, displayName } from './SensorTitles';
import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber } from '@material-ui/core/colors';

interface Props {
    sensor: string;
}

const chartColors = [
    red["200"],
    blue["200"],
    green["200"],
    yellow["200"],
    amber["200"],
    purple["200"],
    cyan["200"],
    teal["200"],
    lightGreen["200"],
    indigo["200"],
    deepPurple["200"],
    lime["200"],
    lightBlue["200"],
    pink["200"],
];

class SensorGraph extends React.Component<Props> {

    private chartElement: HTMLCanvasElement;
    private chart: Chart;

    public constructor(props: Props) {
        super(props);

        const listener = window.matchMedia("(max-width: 600px)")
        listener.addListener(() => this.forceUpdate());

        this.startLoadingResources();
    }

    public componentDidMount() {
        this.chart = new Chart(this.chartElement, {
            type: 'line',
            data: {
                datasets: []
            },
            options: {
                responsive: false,
                title: {
                    display: true,
                    text: this.props.sensor,
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        // distribution: "series",
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Time',
                        },

                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: `${displayName(this.props.sensor)} ${units(this.props.sensor)}`
                        },
                        ticks: {
                            beginAtZero: true,
                            suggestedMax: 10,
                        }
                    }]
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
            },
        });
        this.chart.update();
    }

    public render() {
        return <div>
            <canvas width={Math.min(window.outerWidth - 20, 600)} height="400" ref={e => { if (e != null) { this.chartElement = e; } }} />
        </div >;
    }

    private async startLoadingResources() {

        // fetch the last day of data
        const oldData = await WebRequest.json<SensorReading[]>(
            `${window.location.origin}/data?start=${Math.round((new Date()).getTime() / 1000 - 3600 * 24)}&sensor=${encodeURIComponent(this.props.sensor)}&datawidth=${20 * 60}`)
        if (oldData === undefined) {
            return;
        }

        // sort the old data based on the station it comes from
        const datapoints = {};
        oldData.forEach(d => {
            if (datapoints[d.station] !== undefined) {
                datapoints[d.station].push({ x: new Date(d.time * 1000), y: d.reading });
            } else {
                datapoints[d.station] = [{ x: new Date(d.time * 1000), y: d.reading }];
            }
        });

        if (this.chart !== undefined && this.chart.data.datasets !== undefined) {
            this.chart.data.datasets = Object.keys(datapoints).map((station, idx) => ({
                label: station,
                data: datapoints[station],
                fill: false,
                borderColor: chartColors[idx % chartColors.length],
                backgroundColor: chartColors[idx % chartColors.length],
            }))
            this.chart.update();
        }

        // subscribe to the websockt
        const ws = new WebSocket(`ws://${window.location.hostname}:${window.location.port}/ws?sensor=${encodeURIComponent(this.props.sensor)}`)
        ws.onmessage = event => {
            this.addDataPoint(JSON.parse(event.data));
        }
    }

    private addDataPoint(dataPoint: SensorReading) {
        if (this.chart === undefined) {
            return;
        }

        const datasets = this.chart.data.datasets;
        if (datasets === undefined) { return; }

        // get the station data
        let sensorData: ChartPoint[] | undefined;
        for (const set of datasets) {
            if (set.label !== undefined && set.label === dataPoint.station) {
                sensorData = set.data as ChartPoint[]
            }
        }

        if (sensorData === undefined) {
            // add the station to the graph
            datasets.push({
                label: dataPoint.station,
                data: [{ x: new Date(dataPoint.time * 1000), y: dataPoint.reading }],
                fill: false,
                borderColor: chartColors[datasets.length % chartColors.length],
                backgroundColor: chartColors[datasets.length % chartColors.length]
            });
        } else {
            sensorData.push({ x: new Date(dataPoint.time * 1000), y: dataPoint.reading });
            this.chart.update();
        }
    }

}

export default SensorGraph;
