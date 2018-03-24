import React, { Component } from 'react';
import ServiceSeeker from './containers/ServiceSeeker';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="geo-chat">
        <h2>LocalChat</h2>
        <ServiceSeeker />
      </div>
    );
  }
}

export default App;
