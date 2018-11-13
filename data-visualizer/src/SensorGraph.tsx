import { Chart, ChartPoint } from 'chart.js';
import * as React from 'react';
import * as WebRequest from "web-request";
import { SensorReading } from './SensorData';

interface Props {
    name: string;
}

class SensorGraph extends React.Component<Props> {

    private chartElement: HTMLCanvasElement;
    private chart: Chart;

    public constructor(props: Props) {
        super(props);

        this.startLoadingResources();
    }

    public componentDidMount() {
        this.chart = new Chart(this.chartElement, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Temp (\u00b0 C)',
                    data: [],
                    fill: true,
                    borderColor: '#ff6961',
                    backgroundColor: '#db898455'
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: this.props.name,
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        // distribution: "series",
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Time',
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Temperature (\u00b0 C)'
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
        return <canvas height="200" ref={e => { if (e != null) { this.chartElement = e; } }} />;
    }


    private async startLoadingResources() {

        // fetch the last day of data
        const oldData = await WebRequest.json<SensorReading[]>(
            `${window.location.origin}/data?start=${Math.round((new Date()).getTime() / 1000 - 3600 * 24)}&station=${encodeURIComponent(this.props.name)}`)
        if (oldData === undefined) {
            return;
        }

        if (this.chart !== undefined && this.chart.data.datasets !== undefined) {
            this.chart.data.datasets[0].data = oldData.map(elem => ({ x: new Date(elem.time * 1000), y: elem.temp }));
            this.chart.update();
        }

        // subscribe to the websockt
        const ws = new WebSocket(`ws://${window.location.hostname}:${window.location.port}/ws`)
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

        const tempData = datasets[0].data as ChartPoint[];
        if (tempData === undefined) { return; }

        tempData.push({ x: new Date(dataPoint.time * 1000), y: dataPoint.temp });
        this.chart.update();
    }

}

export default SensorGraph;
