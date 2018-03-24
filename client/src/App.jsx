import React, { Component } from 'react';
import ServiceSeeker from './containers/ServiceSeeker';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="geo-chat">
        <img
          src="https://images.assets-landingi.com/NcyafB63/LocalChat_logo_2.png"
          alt="LocalChat"
          height="80"
        />
        <ServiceSeeker />
      </div>
    );
  }
}

export default App;
