import * as React from 'react';
import './App.css';
import './SensorGraph';
import SensorGrid from './SensorGrid';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <SensorGrid />
      </div >
    );
  }
}

export default App;
