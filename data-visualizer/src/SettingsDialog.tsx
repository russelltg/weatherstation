import * as React from 'react';
import * as WebRequest from "web-request";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableHead, Typography, TableRow, TableCell, IconButton, TableBody, Divider } from '@material-ui/core';

import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';

import StationSettingsRow from './StationSettingsRow';

interface State {
  stations: Station[]
  open: boolean,
  rowsBeingEdited: number,
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
      rowsBeingEdited: 0,
    };
  }

  public componentDidMount() {
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
              {this.state.stations.map(s => (
                <StationSettingsRow
                  key={s.name}
                  nickname={s.name}
                  ip={s.ip}
                  refreshEvent={this.fetchStations}
                  disableOkEvent={this.disableOK}
                />))}
              < TableRow >
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell padding="checkbox">
                  <IconButton onClick={this.addStation}><AddIcon /></IconButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Divider />
          <Button onClick={this.clearDB}><DeleteIcon />Clear Database</Button>
        </DialogContent>
        <DialogActions>
          <Button disabled={this.state.rowsBeingEdited !== 0} onClick={this.onSave}><CheckIcon />Ok</Button>
        </DialogActions>
      </Dialog>
    </>;
  }

  private fetchStations = async () => {
    this.setState({
      rowsBeingEdited: Math.max(0, this.state.rowsBeingEdited - 1),
    });
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

  private onSave = () => {
    this.setState({
      open: false,
    });
  }

  private clearDB = () => {
    WebRequest.delete(`${window.location.origin}/data`);
  }

  private disableOK = () => {
    this.setState({
      rowsBeingEdited: this.state.rowsBeingEdited + 1,
    });
  }
}

export default SettingsDialog;
