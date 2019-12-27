import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Count, Form, PickButton} from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Count />, document.getElementById('sideButtons'));
ReactDOM.render(<Form />, document.getElementById('form'));
ReactDOM.render(<PickButton />, document.getElementById('pickButtonDiv'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
