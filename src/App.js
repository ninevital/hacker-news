import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Link } from "react-router-dom";
import News from './News';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
  
    };
  }

  

  render() {
    return(    
      <div>
        <News /> 
      </div>
    )   
  }
}

export default App;
