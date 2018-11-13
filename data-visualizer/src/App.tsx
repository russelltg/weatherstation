import * as React from 'react';
import './App.css';
import './SensorGraph';
import SensorGraph from './SensorGraph';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <SensorGraph name="Station 1" />
      </div >
    );
  }
}

export default App;
