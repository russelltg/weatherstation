import * as React from 'react';
import * as WebRequest from "web-request";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableHead, Typography, TableRow, TableCell, IconButton, TableBody } from '@material-ui/core';

import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';

import StationSettingsRow from './StationSettingsRow';

interface State {
  stations: Station[]
  open: boolean,
}

interface Station {
  name: string,
  ip: string,
}

class SettingsDialog extends React.Component<{}, State> {
  public constructor(props: {}) {
    super(props);

    this.state = {
      stations: [],
      open: false,
    };

    this.fetchStations();
  }

  public render() {
    return <>
      <IconButton onClick={this.openDialog}><SettingsIcon /></IconButton>
      <Dialog open={this.state.open}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Typography variant="subheading">Connected Stations</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nickname</TableCell>
                <TableCell>IP</TableCell>
                <TableCell />
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.stations.map(s => (<StationSettingsRow key={s.name} nickname={s.name} ip={s.ip} refreshEvent={this.fetchStations} />))}
              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell>
                  <IconButton onClick={this.addStation}><AddIcon /></IconButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onSave}><CheckIcon />Ok</Button>
        </DialogActions>
      </Dialog>
    </>;
  }

  private fetchStations = async () => {
    const response = await WebRequest.get(
      `${window.location.origin}/stations`);

    if (response.statusCode !== 200) {
      return;
    }

    const stationList = JSON.parse(response.content) as Station[];

    this.setState({
      stations: stationList,
    });
  }

  private addStation = async () => {
    const resp = await WebRequest.put(`${window.location.origin}/stations?name=StationName&ip=0.0.0.0`);
    if (resp.statusCode !== 200) {
      return;
    }

    this.setState({
      stations: [...this.state.stations, { name: 'StationName', ip: "0.0.0.0" }]
    })
  };

  private openDialog = () => {
    this.setState({
      open: true,
    });
  }

  private onSave = async () => {
    this.setState({
      open: false,
    });
  }
}

export default SettingsDialog;
