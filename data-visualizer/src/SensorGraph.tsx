import { Chart, ChartPoint } from 'chart.js';
import * as React from 'react';
import * as WebRequest from "web-request";
import { SensorReading } from './SensorData';
import './SensorTitles';
import { units, displayName } from './SensorTitles';
import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber } from '@material-ui/core/colors';
import { Menu, List, ListItem, ListItemText, MenuItem } from '@material-ui/core';

interface Props {
  sensor: string;
}

interface State {
  timeToShow: string;
  anchor: HTMLElement | null;
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

const timeOptions = {
  '1 minute': 60,
  '1 hour': 60 * 60,
  '1 day': 60 * 60 * 24,
};

class SensorGraph extends React.Component<Props, State> {

  private chartElement: HTMLCanvasElement;
  private chart: Chart;

  public constructor(props: Props) {
    super(props);

    this.state = {
      timeToShow: '1 minute',
      anchor: null,
    };

    const listener = window.matchMedia("(max-width: 600px)")
    listener.addListener(() => this.forceUpdate());

    this.startLoadingResources(timeOptions[this.state.timeToShow]);
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
          text: displayName(this.props.sensor),
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
            time: {
              max: new Date() as any,
            }

          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: `${displayName(this.props.sensor)} ${units(this.props.sensor)}`
            },
            ticks: {
              beginAtZero: true,
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
      <canvas
        width={Math.min(window.outerWidth - 20, 600)}
        height="400"
        ref={e => { if (e != null) { this.chartElement = e; } }}
      />
      <List>
        <ListItem
          button
          onClick={this.openMenu}
        >
          <ListItemText primary="Duration to Show" secondary={this.state.timeToShow} />
        </ListItem>
      </List>
      <Menu
        open={this.state.anchor != null}
        anchorEl={this.state.anchor}
        onClose={this.closeMenu}
      >
        {Object.keys(timeOptions).map(t => (
          <MenuItem
            key={t}
            selected={this.state.timeToShow === timeOptions[t]}
            onClick={this.switchTimeMode(t)}
          >
            {t}
          </MenuItem>
        ))}
      </Menu>
    </div >;
  }

  private async startLoadingResources(secsAgo: number) {

    // 75 points is the goal
    const start = Math.round((new Date()).getTime() / 1000 - secsAgo);
    const width = Math.round(secsAgo / 75);

    // fetch the last day of data
    const oldData = await WebRequest.json<SensorReading[]>(
      `${window.location.origin}/data?start=${start}&sensor=${encodeURIComponent(this.props.sensor)}&datawidth=${width}`)
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
        pointRadius: 3,
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
        backgroundColor: chartColors[datasets.length % chartColors.length],
        pointRadius: 0,
      });
    } else {
      sensorData.push({ x: new Date(dataPoint.time * 1000), y: dataPoint.reading });

      this.auditData();
    }
    if (this.chart.config !== undefined &&
      this.chart.config.options !== undefined &&
      this.chart.config.options.scales !== undefined &&
      this.chart.config.options.scales.xAxes !== undefined &&
      this.chart.config.options.scales.xAxes[0].time !== undefined
    ) {
      this.chart.config.options.scales.xAxes[0].time.max = new Date() as any;
    }
    this.chart.update();
  }

  private auditData() {
    const earliestAcceptable = (new Date()).getTime() - 24 * 3600 * 1000;

    const datasets = this.chart.data.datasets
    if (datasets === undefined) { return; }

    // remove datapoints over a day old
    for (const dataset of datasets) {
      const data = dataset.data as ChartPoint[];
      while (data[0].x as number < earliestAcceptable) {
        data.shift()
      }
    }

    const earliestTime = Math.min(...datasets.map(d => {
      const data = d.data as ChartPoint[];
      return data[0].x as number;
    }));
    const lastTime = Math.max(...datasets.map(d => {
      const data = d.data as ChartPoint[];
      return data[data.length - 1].x as number;
    }));

    const timeSpan = lastTime - earliestTime;

    // 1% of the total width is the smallest acceptable
    const acceptableDeltaT = timeSpan / 100.0;

    // merge datapoints that are too close together
    for (const dataset of datasets) {
      const data = dataset.data as ChartPoint[];

      for (let i = 0; i < data.length - 3; ++i) {
        const t0 = data[i].x as Date;
        const t1 = data[i + 1].x as Date;
        if ((t1.getTime() - t0.getTime()) < acceptableDeltaT) {
          // average it
          const averageTime = (t0.getTime() + t1.getTime()) / 2;
          const averageValue = (data[i].y as number + (data[i + 1].y as number)) / 2
          data[i] = { x: new Date(averageTime), y: averageValue };
          data.splice(i, 1);
        }
      }
    }
  }

  private openMenu = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ anchor: event.currentTarget });
  }
  private closeMenu = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ anchor: null });
  }

  private switchTimeMode = (time: string) => () => {
    this.setState({ timeToShow: time, anchor: null });
    this.startLoadingResources(timeOptions[time]);
  }
}

export default SensorGraph;
