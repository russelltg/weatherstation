import * as React from 'react';
import * as WebRequest from "web-request";
import { TableCell, IconButton, TableRow, TextField } from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';

interface Props {
  nickname: string,
  ip: string,
}

interface State {
  state: 'default' | 'editing' | 'changing';
}

class StationSettingsRow extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);

    this.state = {
      state: 'default',
    };
  }

  public render() {

    switch (this.state.state) {
      case 'default':
        return <TableRow>
          <TableCell>{this.props.nickname}</TableCell>
          <TableCell>{this.props.ip}</TableCell>
          <TableCell><IconButton onClick={this.onClick}><EditIcon /></IconButton></TableCell>
        </TableRow>;
      case 'editing':
        return <TableRow>
          <TableCell><TextField /></TableCell>
          <TableCell><TextField /></TableCell>
          <TableCell><IconButton onClick={this.onClick}><CheckIcon /></IconButton></TableCell>
        </TableRow>;
      case 'changing':
        return <TableRow>
          <TableCell><TextField disabled /></TableCell>
          <TableCell><TextField disabled /></TableCell>
          <TableCell><IconButton disabled><CheckIcon /></IconButton></TableCell>
        </TableRow>
    }
  }

  private onClick = async () => {
    switch (this.state.state) {
      case 'default':
        this.setState({ state: 'editing' });
        break;
      case 'editing':
        const response = await WebRequest.delete(
          `${window.location.origin}/stations?name=${encodeURIComponent(this.props.nickname)}`)

        if (response.statusCode !== 200) {

        }
    }
  };
}


export default StationSettingsRow;
