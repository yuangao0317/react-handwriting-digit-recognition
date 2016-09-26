import React, { Component } from 'react';
import { Provider } from 'react-redux';
import App from './App';

/* Import other components if needed here */




module.exports = class Root extends Component {
  render() {
    const { store } = this.props;
    return (
      /**
       * Provider is a component provided to us by the 'react-redux' bindings that
       * wraps our app - thus making the Redux store/state available to our 'connect()'
       * calls in component hierarchy below.
       */
      <Provider store={store}>
        <div>
          <App />
          {/* Add other components here */}
          
        </div>
      </Provider>
    );
  }
};
