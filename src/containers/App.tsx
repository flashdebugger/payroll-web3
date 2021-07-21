import { Component } from 'react';
import './App.css';
//Router import
import { BrowserRouter, } from "react-router-dom";
//Components import
import { AppRouter } from 'containers'

class App extends Component {

  render() {
    return (
      <div className='App'>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </div>
    );
  }
}

export default App;
