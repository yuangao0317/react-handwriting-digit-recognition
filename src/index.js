import React from 'react';
import ReactDOM from 'react-dom';


/* Import stylesheet here */
import './styles/main.css';


/* Require configureStore and Root here */
import { configureStore } from './store/configureStore';
import { Root } from './containers/Root';

const store = configureStore();
ReactDOM.render(
  <Root store={store} />,
  document.getElementById('root')
);