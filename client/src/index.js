import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';

/* React-Redux store */
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

/* Creating a Redux store */
import { createStore, applyMiddleware, compose } from 'redux';
import libraryApp from './reducers/rootReducer';
const store = createStore(
    libraryApp, // root reducer
    compose(
        applyMiddleware(thunk)
    )
);

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>, 
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
