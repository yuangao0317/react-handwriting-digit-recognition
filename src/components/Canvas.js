import React, { Component, PropTypes } from 'react';

export default class Canvas extends Component {
  constructor(props, context) {
    super(props, context);
  }

  handleAction1() {
    this.props.canvasActions.action1();
  }

  handleAction2() {
    this.props.canvasActions.action2();
  }

  render() {
    return (
      <div className="">
        <div className="">{this.props.canvasState}</div>
        <br />
        <div className="">
          <button onClick={() => {this.handleAction1();}}>-</button>
          <button onClick={() => {this.handleAction2();}}>+</button>
        </div>
      </div>
    );
  }
}


/* Import props here */
Counter.propTypes = {
  canvasState: PropTypes.number.isRequired,
  canvasActions: PropTypes.object.isRequired
};
