import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import beep from './beep';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      running: false,
      currentMode: 'station',
      stationSeconds: 10,
      breakSeconds: 15,
      secondsLeft: null
    };
    this.tick = this.tick.bind(this);
    this.startCircuit = this.startCircuit.bind(this);
    this.pause = this.pause.bind(this);
    this.unpause = this.unpause.bind(this);
    this.reset = this.reset.bind(this);
    this.handleStationLengthChange = this.handleStationLengthChange.bind(this);
    this.handleBreakLengthChange = this.handleBreakLengthChange.bind(this);
  }

  componentDidUpdate(){
    if (!this.state.running) return;
    if (this.state.secondsLeft === 0) {
      this.switchModes();
    } else {
      window.timeout = setTimeout(this.tick, 1000);
    }
  }

  handleStationLengthChange(event) {
    this.setState({ stationSeconds: event.target.value });
  }

  handleBreakLengthChange(event) {
    this.setState({ breakSeconds: event.target.value });
  }

  beep() {
    beep();
    if (window.navigator.vibrate) window.navigator.vibrate(300);
  }

  tick() {
    this.setState({ secondsLeft: this.state.secondsLeft - 1 });
  }

  startCircuit() {
    this.setState({ running: true, secondsLeft: this.state.stationSeconds });
  }

  pause() {
    this.setState({ running: false });
    clearTimeout(window.timeout);
  }

  unpause() {
    this.setState({ running: true });
  }

  reset() {
    this.setState({ running: false, secondsLeft: null });
    clearTimeout(window.timeout);
  }

  switchModes() {
    const newMode = this.state.currentMode === 'station' ? 'break' : 'station';
    this.setState({
      currentMode: newMode,
      secondsLeft: this.state[`${newMode}Seconds`]
    });
    this.beep();
  }

  render() {
    return (
      <div className="App">
        <label>Station length in seconds</label>
        <input type="text"
          value={this.state.stationSeconds}
          onChange={this.handleStationLengthChange}
          disabled={this.state.running}></input>
        <label>Break length in seconds</label>
        <input type="text"
          value={this.state.breakSeconds}
          onChange={this.handleBreakLengthChange}
          disabled={this.state.running}></input>
        {!this.state.secondsLeft && <button onClick={this.startCircuit}>Start Circuit</button>}
        {this.state.running ? <button onClick={this.pause}>Pause</button> : <button onClick={this.unpause}>Unpause</button>  }
        <p>{this.state.currentMode}</p>
        <p>{this.state.secondsLeft}</p>
      </div>
    );
  }
}

export default App;
