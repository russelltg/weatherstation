import * as React from 'react';
import * as WebRequest from "web-request";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableHead, Typography, TableRow, TableCell, IconButton, TableBody } from '@material-ui/core';

import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import StationSettingsRow from './StationSettingsRow';

interface Props {
  open: boolean,
};

interface State {
  stations: Station[]
}

interface Station {
  name: string,
  ip: string,
}

class SettingsDialog extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      stations: []
    };

    this.fetchStations();
  }

  public render() {
    return <Dialog open={this.props.open}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Typography variant="subheading">Connected Stations</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nickname</TableCell>
              <TableCell>IP</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.stations.map(s => (<StationSettingsRow key={s.name} nickname={s.name} ip={s.ip} />))}
            <TableRow>
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
        <Button><SaveIcon />Save</Button>
      </DialogActions>
    </Dialog>
  }

  public async fetchStations() {
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

}

export default SettingsDialog;
