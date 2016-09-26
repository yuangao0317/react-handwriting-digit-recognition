import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/* Import actions here */
import * as CounterActions from '../actions/CounterActions'; // Fake

/* Import components here */
import Counter from '../components/Counter'; // Fake
import Footer from '../components/Footer';

/**
 * It is common practice to have a 'Root' container/component require our main App (this one).
 * Again, this is because it serves to wrap the rest of our application with the Provider
 * component to make the Redux store available to the rest of the app.
 */
class App extends Component {
  render() {
    // we can use ES6's object destructuring to effectively 'unpack' our props
    const { counter, actions } = this.props;
    return (
      <div className="main-app-container">
        <div className="main-app-nav">Simple Redux Boilerplate</div>
        {/* notice that we then pass those unpacked props into the Counter component */}
        <Counter counter={counter} actions={actions} />
        <Footer />
      </div>
    );
  }
}

/* Define propTypes here */
App.propTypes = {
  counter: PropTypes.number.isRequired,
  actions: PropTypes.object.isRequired
};

/* Pass state to its component here */
function mapStateToProps(state) {
  return {
    counter: state.counter
  };
}

/* Map actions here */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(CounterActions, dispatch)
  };
}



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
