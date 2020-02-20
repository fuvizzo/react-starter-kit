import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './app';
import './App.css';
import configureStore from './redux/configureStore';

const store = configureStore();

ReactDOM.render(
  <Provider onUpdate={() => window.scrollTo(0, 0)} store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('app')
);
