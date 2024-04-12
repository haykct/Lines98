import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css'
import Board from './components/board';

class MyGame extends Component {
  
  render() {
    return <Board boardSize={9} />
  }
}

ReactDOM.render(
  <MyGame/>,
  document.getElementById('root')
);