import React, { Component } from 'react';
import image from '../assets/images/Neural Network Diagram.png';

export default class Details extends Component {
  render() {
    return (
      <div className="row">
      <div className="col-md-2"></div>
      	<div className="col-md-9">
      		<h2 className="center">Neural Network with Backpropagation Algorithm</h2>
      		<div className="dividewhite1"></div>
      		<img id="inner" src={image} alt="Neural Network Diagram"/>
      		<div className="dividewhite4"></div>
      		<div>
      			<ul>
      				<li>
      					<h4>Data Set</h4>
      					<p>I used the <a href="http://yann.lecun.com/exdb/mnist/">MNIST database of handwritten digits</a>. It is a good database for people who want to try learning techniques and pattern recognition methods on real-world data while spending minimal efforts on preprocessing and formatting.</p>
      				</li>
      			</ul>
      			
      			
      		</div>
      	</div>
      </div>
    );
  }
}
