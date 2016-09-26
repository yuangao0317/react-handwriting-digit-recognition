import React, { Component, PropTypes } from 'react';

export default class Canvas extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleRecognize = this.handleRecognize.bind(this);
  }

  componentDidMount() {}
  componentDidUpdate(prevProps) {}
  componentWillUnmount() {}

  handleRecognize() {
    this.props.canvasActions.recognizeAsync(this.refs.canvas);
  }

  handleClear() {
    this.props.canvasActions.clear();
  }

  render() {
    /* Extract props here */
    const { canvasState } = this.props;

    const canvasStyle = {
      top: '10%', 
      left: '10%',
      border: '2px solid'
    };

    return (
      <div className="">
        <div><canvas ref="canvas" width={200} height={200} style={canvasStyle}></canvas></div>
        <div className="">{canvasState.recognizeResult}</div>
        <br />
        <div className="">
          <button onClick={() => {this.handleRecognize();}}>Recognize</button>
          <button onClick={() => {this.handleClear();}}>Clear</button>
        </div>
      </div>
    );
  }
}


/* Import props here */
Canvas.propTypes = {
  canvasState: PropTypes.object.isRequired,
  canvasActions: PropTypes.object.isRequired
};
