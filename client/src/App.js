import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';

import Demo from './components/Demo';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ViewBook from "./components/ViewBook"

const App = () => {
    return (
        <div className="App">
            <Switch>
                <Route exact path='/login' component={Login} />
                <Route exact path='/register' component={Register} />
                <Route exact path='/home' component={Home} />
                <Route exact path='/book/:id' component={ViewBook} />
                <Route exact path='/' component={Demo} />
            </Switch>
        </div>
    );
}

export default App;
