import React, { Component, PropTypes } from 'react';

export default class Canvas extends Component {
  constructor(props, context) {
    super(props, context);

    this.prevX = 0;
    this.currX = 0;
    this.prevY = 0;
    this.currY = 0;
    this.paths = []; // recording paths
    this.paintFlag = false;
    this.lineWidth = 10; // this value cannot be small

  }

  componentDidMount() {
    this.canvas = this.refs.canvas;
    this.ctx = this.canvas.getContext("2d");

    let that = this;

    this.canvas.addEventListener("mousemove", function (e) {
      that.drawing('move', e);
    }, false);
    this.canvas.addEventListener("mousedown", function (e) {
      that.drawing('down', e);
    }, false);
    this.canvas.addEventListener("mouseup", function (e) {
      that.drawing('up', e);
    }, false);
    this.canvas.addEventListener("mouseout", function (e) {
      that.drawing('out', e);
    }, false);
  }

  drawing(res, e) {
    let canvas = this.canvas;
    let ctx = this.ctx;

    if (res == 'down') {
      if (e.pageX != undefined && e.pageY != undefined) {
        this.currX = e.pageX-canvas.offsetParent.offsetLeft-canvas.offsetLeft;
        this.currY = e.pageY-canvas.offsetParent.offsetTop-canvas.offsetTop;
        console.log(this.currX)
          console.log(this.currY)
      } else {
        this.currX = e.clientX + document.body.scrollLeft
          + document.documentElement.scrollLeft
          - canvas.offsetLeft;
        this.currY = e.clientY + document.body.scrollTop
          + document.documentElement.scrollTop
          - canvas.offsetTop;
      }
      //draw a circle
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.arc(this.currX,this.currY, this.lineWidth/2,0,2*Math.PI);
      ctx.stroke();
      ctx.closePath();
      ctx.fill();

      this.paths.push([[this.currX], [this.currY]]);
      this.paintFlag = true;
    }
    if (res == 'up' || res == "out") {
      this.paintFlag = false;
    }

    if (res == 'move') {
      if (this.paintFlag) {
        // draw a line to previous point
        this.prevX = this.currX;
        this.prevY = this.currY;
        if (e.pageX != undefined && e.pageY != undefined) {
          this.currX = e.pageX-canvas.offsetParent.offsetLeft-canvas.offsetLeft;
          this.currY = e.pageY-canvas.offsetParent.offsetTop-canvas.offsetTop;
        } else {
          this.currX = e.clientX + document.body.scrollLeft
            + document.documentElement.scrollLeft
            - canvas.offsetLeft;
          this.currY = e.clientY + document.body.scrollTop
            + document.documentElement.scrollTop
            - canvas.offsetTop;
        }
        let currPath = this.paths[this.paths.length-1];
        currPath[0].push(this.currX);
        currPath[1].push(this.currY);
        this.paths[this.paths.length-1] = currPath;
        this.drawline(ctx, "black", this.lineWidth, this.prevX, this.prevY, this.currX, this.currY);
      }
    }
  }

  drawline(ctx, color, lineWidth, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
  }

  componentDidUpdate(prevProps) {}
  componentWillUnmount() {}

  handleRecognize() {
    let canvasCopy = document.createElement("canvas");
    let canvasData = {
      canvas: this.canvas,
      canvasCopy: canvasCopy,
      paths: this.paths
    }
    this.props.canvasActions.recognizeAsync(canvasData);
  }

  handleClear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.paths = []; 

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
      <div className="container">
        <div className="container">
        <div className="col-md-3"></div>
        <div className="col-md-4">
          <div className="row">
            <canvas id="canvas" ref="canvas" width={200} height={200} style={canvasStyle}></canvas>

            <div>
              <button className="btn btn-primary" onClick={() => {this.handleRecognize();}}>Recognize</button>
              <button className="btn btn-primary" onClick={() => {this.handleClear();}}>Clear</button>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="container"><span id="result">{canvasState.recognizeResult}</span></div>
        </div>
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
