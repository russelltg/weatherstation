import * as React from 'react';
import * as WebRequest from "web-request";
import { TableCell, IconButton, TableRow, TextField } from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';

interface Props {
  nickname: string,
  ip: string,
  refreshEvent: () => void,
  disableOkEvent: () => void,
}

interface State {
  state: 'default' | 'editing' | 'changing',
  name: string,
  ip: string,
}

class StationSettingsRow extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);

    this.state = {
      state: 'default',
      name: props.nickname,
      ip: props.ip,
    };
  }

  public render() {

    switch (this.state.state) {
      case 'default':
        return <TableRow>
          <TableCell>{this.props.nickname}</TableCell>
          <TableCell>{this.props.ip}</TableCell>
          <TableCell padding="checkbox"><IconButton onClick={this.onClick}><EditIcon /></IconButton></TableCell>
          <TableCell padding="checkbox"><IconButton onClick={this.onDelete}><DeleteIcon /></IconButton></TableCell>
        </TableRow>;
      default:
        const disabled = this.state.state === 'changing';
        return <TableRow>
          <TableCell><TextField disabled={disabled} value={this.state.name} onChange={this.onNameChange} /></TableCell>
          <TableCell><TextField disabled={disabled} value={this.state.ip} onChange={this.onIPChange} /></TableCell>
          <TableCell />
          <TableCell padding="checkbox"><IconButton disabled={disabled} onClick={this.onClick}><CheckIcon /></IconButton></TableCell>
        </TableRow>;
    }
  }

  private onClick = async () => {
    switch (this.state.state) {
      case 'default':
        this.props.disableOkEvent();
        this.setState({ state: 'editing' });
        break;
      case 'editing':
        this.setState({ state: 'changing' });
        const delResponse = await WebRequest.delete(
          `${window.location.origin}/stations?name=${encodeURIComponent(this.props.nickname)}`)

        if (delResponse.statusCode !== 200) {
          this.setState({
            state: 'default',
            name: this.props.nickname,
            ip: this.props.ip,
          });
          return;
        }

        const addResponse = await WebRequest.put(
          `${window.location.origin}/stations?name=${encodeURIComponent(this.state.name)}&ip=${encodeURIComponent(this.state.ip)}`);

        if (addResponse.statusCode !== 200) {
          this.setState({
            state: 'default',
            name: this.props.nickname,
            ip: this.props.ip,
          });
          return;
        }
        this.setState({
          state: 'default',
        })
        this.props.refreshEvent();
    }
  };

  private onDelete = async () => {
    await WebRequest.delete(
      `${window.location.origin}/stations?name=${encodeURIComponent(this.props.nickname)}`)
    this.props.refreshEvent();
  }

  private onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value });
  }
  private onIPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ip: event.target.value });
  }
}


export default StationSettingsRow;
