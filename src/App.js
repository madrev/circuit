import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import beep from './beep';
import EXERCISES from './exercises';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      running: false,
      currentMode: 'station',
      stationSeconds: 10,
      breakSeconds: 15,
      secondsLeft: null,
      stationType: 'aerial',
      completedExercises: [],
      currentExercise: null
    };
    this.tick = this.tick.bind(this);
    this.startCircuit = this.startCircuit.bind(this);
    this.pause = this.pause.bind(this);
    this.unpause = this.unpause.bind(this);
    this.reset = this.reset.bind(this);
    this.handleStationLengthChange = this.handleStationLengthChange.bind(this);
    this.handleBreakLengthChange = this.handleBreakLengthChange.bind(this);
    this.setNewExercise = this.setNewExercise.bind(this);
  }

  componentWillMount() {
    this.setNewExercise();
  }

  componentDidUpdate(){
    if (!this.state.running) return;
    if (this.state.secondsLeft === 0) this.switchModes();
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
    window.timeout = setTimeout(() => {
      this.setState({ secondsLeft: this.state.secondsLeft - 1}, this.tick);
    }, 1000);
  }

  startCircuit() {
    this.setState({ running: true, secondsLeft: this.state.stationSeconds }, this.tick);
  }

  pause() {
    this.setState({ running: false });
    clearTimeout(window.timeout);
  }

  unpause() {
    this.setState({ running: true });
    this.tick();
  }

  reset() {
    this.setState({ running: false, secondsLeft: null });
    clearTimeout(window.timeout);
  }

  switchStationType() {
    const newStationType = this.state.stationType === 'aerial' ? 'ground' : 'aerial';
    this.setState({ stationType: newStationType }, this.setNewExercise);
  }

  setNewExercise() {
    const exerciseSet = EXERCISES[this.state.stationType].filter((exercise) => {
      return exercise !== this.state.currentExercise &&
            this.state.completedExercises.indexOf(exercise)=== -1;
    });
    const newExercise = exerciseSet[Math.floor(Math.random()*exerciseSet.length)];
    this.setState({ currentExercise: newExercise });
  }

  switchModes() {
    if (this.state.currentMode === 'station') {
      this.setState({
        currentMode: 'break',
        completedExercises: [...this.state.completedExercises, this.state.currentExercise],
        secondsLeft: this.state.breakSeconds
      });
      this.switchStationType();
    } else if (this.state.currentMode === 'break') {
      this.setState({
        currentMode: 'station',
        secondsLeft: this.state.stationSeconds
      });
    }
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
        <div className="current-exercise" onClick={this.setNewExercise}>{this.state.currentExercise}</div>
      </div>
    );
  }
}

export default App;
