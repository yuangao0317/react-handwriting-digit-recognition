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
      				<li>
      					<h4>Implement Detail</h4>
      					<p>For the Neural Network Implement details, checkout my blogs:</p>
      					<ul>
      						<li><a href="https://github.com/YuanGao0317/A-Machine-Learning-Blog-Series/blob/master/Blog/5%20Neural%20Networks.pdf">Neural Network</a></li>
      						<li><a href="https://github.com/YuanGao0317/A-Machine-Learning-Blog-Series/blob/master/Blog/6%20Backpropagation%20Algorithm.pdf">Backpropagation Algorithm</a></li>
      					</ul>
      				</li>
      			</ul>
      		</div>
      	</div>
      </div>
    );
  }
}
