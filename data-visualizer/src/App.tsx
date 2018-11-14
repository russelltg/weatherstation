import * as React from 'react';
import './App.css';
import './SensorGraph';
import SensorGrid from './SensorGrid';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <h1> Weather Station Data </h1>
        <SensorGrid />
      </div >
    );
  }
}

export default App;
