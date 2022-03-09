import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import News from './News';
import { Routes, Route } from "react-router-dom";
import NewsPage from './NewsPage';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className="App">
        <Routes>
          <Route exact path="/" element={<News />} />
          <Route path="news/:id" element={<NewsPage />} />
        </Routes>
      </div>
    )
  }
}

export default App;
