import { theta1, theta2 } from './thetas';

/* only works on the dataset with 20x20 images */
export default class ImageProcessor {
	constructor(canvasData) {
		this.canvas = canvasData.canvas;
		this.paths = canvasData.paths;
		this.theta1 = theta1;
		this.theta2 = theta2;
	}

	analyseImage(){
		let canvas = this.canvas;
		let paths = this.paths;
		let ctx = this.canvas.getContext('2d');
		let imgData = ctx.getImageData(0, 0, 200, 200);
		let grayImage = this.imageDataToGrayscale(imgData);
		const bounds = this.getBoundingRectangle(grayImage, 0.01);
		const center = this.getCenterOfImage(grayImage);

		let canvasCopy = this.canvas;
		canvasCopy.width = imgData.width;
	  canvasCopy.height = imgData.height;
		let copyCtx = canvasCopy.getContext("2d");
	  const brW = bounds.maxX+1-bounds.minX;
	  const brH = bounds.maxY+1-bounds.minY;
	  const scaling = 150 / (brW>brH?brW:brH);


	  // scale and change origin
	  copyCtx.translate(canvas.width/2, canvas.height/2);
	  copyCtx.scale(scaling, scaling);
	  copyCtx.translate(-canvas.width/2, -canvas.height/2);
	  // move to center based on new origin
	  copyCtx.translate(center.transX, center.transY);


	  // redraw on new canvas
	  for (let p = 0; p < paths.length; p++) {
	    for (let i = 0; i < paths[p][0].length - 1; i++) {
	      const x1 = paths[p][0][i];
	      const y1 = paths[p][1][i];
	      const x2 = paths[p][0][i+1];
	      const y2 = paths[p][1][i+1];
	      this.drawline(copyCtx, "black", 20 / scaling, x1, y1, x2, y2);
	    }
	  }

	  // copyCtx.drawImage(ctx.canvas, 0, 0);
	  // read new canvas image data
	  imgData = copyCtx.getImageData(0, 0, 200, 200);
	  const bwInvertImage = this.imageToInvertBW(imgData);

	  // scale image from 200x200 to 20x20
	  let nnInput = new Array(400);
	  for (let y = 0; y < 20; y++) {
	    for (let x = 0; x < 20; x++) {
	      let mean = 0;
	      for (let v = 0; v < 10; v++) {
	        for (let h = 0; h < 10; h++) {
	          mean += bwInvertImage[y*10 + v][x*10 + h];
	        }
	      }
	      // avg of 10x10
	      mean = mean / 100; 
	      // change color range from 0~1 to -1~1, BW to GW
	      nnInput[x*20+y] = (mean - .5) / .5;
	      if (nnInput[x*20+y] === -1) nnInput[x*20+y] = 0;
	    }
	  }

	  // calculate the image RGB info and put it back on canvas
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	  ctx.drawImage(copyCtx.canvas, 0, 0);
	  for (let y = 0; y < 20; y++) {
	    for (let x = 0; x < 20; x++) {
	      let block = ctx.getImageData(x * 10, y * 10, 10, 10);
	      let newVal = 255 * (0.5 + nnInput[x*20+y]/2);
	      for (let i = 0; i < 4 * 10 * 10; i+=4) {
	        block.data[i] = newVal;
	        block.data[i+1] = newVal;
	        block.data[i+2] = newVal;
	        block.data[i+3] = 255;
	      }
	      ctx.putImageData(block, x * 10, y * 10);
	    }
	  }

	  return this.nnPrediction(nnInput, this.theta1, this.theta2);
	}

	imageDataToGrayscale(imgData) {
	  let grayscaleImg = [];
	  for (let y = 0; y < imgData.height; y++) {
	    grayscaleImg[y]=[];
	    for (let x = 0; x < imgData.width; x++) {
	      const offset = y * 4 * imgData.width + 4 * x;
	      const alpha = imgData.data[offset+3];
	      // weird: when painting with stroke, alpha == 0 means white;
	      // alpha > 0 is a grayscale value; in that case I simply take the R value
	      if (alpha == 0) {
	        imgData.data[offset] = 255;
	        imgData.data[offset+1] = 255;
	        imgData.data[offset+2] = 255;
	      }
	      imgData.data[offset+3] = 255;
	      // simply take red channel value. Not correct, but works for
	      // black or white images.
	      grayscaleImg[y][x] = (imgData.data[y*4*imgData.width + x*4 + 0] / 255);
	    }
	  }
	  return grayscaleImg;
	}

	imageToInvertBW(imgData) {
	  let grayscaleImg = [];
	  for (let y = 0; y < imgData.height; y++) {
	    grayscaleImg[y]=[];
	    for (let x = 0; x < imgData.width; x++) {
	      const offset = y * 4 * imgData.width + 4 * x;
	      const alpha = imgData.data[offset+3];
	      // when painting with stroke, alpha == 0 means white(0 0 0 0), black is 0 0 0 255;
	      if (alpha == 0) {
	        imgData.data[offset] = 255;
	        imgData.data[offset+1] = 255;
	        imgData.data[offset+2] = 255;
	      }
	      imgData.data[offset+3] = 255;
	      // YIQ algorithm, translate RGB to YIQ, and delete color zone I and Q. Then I can get BW image, range 0~1
	      let Y = (0.299*imgData.data[offset] + 0.587*imgData.data[offset+1] + 0.114*imgData.data[offset+2]) / 255
	      grayscaleImg[y][x] = 1-Y;
	    }
	  }
	  return grayscaleImg;
	}


	getBoundingRectangle(img, threshold) {
	  const rows = img.length;
	  const columns = img[0].length;
	  let minX=columns;
	  let minY=rows;
	  let maxX=-1;
	  let maxY=-1;
	  for (let y = 0; y < rows; y++) {
	    for (let x = 0; x < columns; x++) {
	      if (img[y][x] < threshold) {
	        if (minX > x) minX = x;
	        if (maxX < x) maxX = x;
	        if (minY > y) minY = y;
	        if (maxY < y) maxY = y;
	      }
	    }
	  }
	  return { minY: minY, minX: minX, maxY: maxY, maxX: maxX};
	}

	getCenterOfImage(img) {
	  //Every body has a point where its whole mass is concentrated so we can lift any body, by applying force on that point only.
	  //Center of Mass (COM) is a point where whole body's mass is assumed to be concentrated.
	  // Center of mass algorithm: x = (m1*x1 + m2*x2 + ... + m*x) / (m1 + ... + m)
	  let meanX = 0;
	  let meanY = 0;
	  const rows = img.length;
	  const columns = img[0].length;
	  let sumPixels = 0;
	  for (let y = 0; y < rows; y++) {
	    for (let x = 0; x < columns; x++) {
	      // have to invert the image because the background is 1, the info is 0
	      const pixel = (1 - img[y][x]);
	      sumPixels += pixel;
	      meanY += y * pixel;
	      meanX += x * pixel;
	    }
	  }

	  meanX /= sumPixels;
	  meanY /= sumPixels;
	  
	  const dY = Math.round(rows/2 - meanY);
	  const dX = Math.round(columns/2 - meanX);
	  return {transX: dX, transY: dY};
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

	//neural net with one hidden layer; sigmoid for hidden, softmax for output
  nnPrediction(data, theta1, theta2) {
  	// add bias
    if (data.length == 400) data.unshift(1);
    if (theta1.length == 25) {
      const bias = Array(theta1[0].length).fill(1);
      theta1.unshift(bias);
    }

    // just some incomplete sanity checks to find the most obvious errors
    if (!Array.isArray(data) || data.length == 0 ||
        !Array.isArray(theta1) || theta1.length == 0 || !Array.isArray(theta1[0]) || data.length != theta1[0].length ||
        !Array.isArray(theta2) || theta2.length == 0 || !Array.isArray(theta2[0]) || theta1.length != theta2[0].length) {
        console.error('invalid parameters in nn function');
        return undefined;
    }

    const num_labels = theta2.length;
    let prediction = undefined;

    // compute layer2 output, units2 should be 1x26
    let units2 = Array(theta1.length).fill(0);
    for (let i=0; i<theta1.length; i++) {

      for (let j=0; j<theta1[i].length; j++) {
        units2[i] += data[j] * theta1[i][j];
      }
      units2[i] = 1 / (1 + Math.exp(-units2[i]));
    }

    //compute layer3 activation, units3 should be 1x10
    let units3 = Array(theta2.length).fill(0);
    for (let i=0; i<theta2.length; i++) {

      for (let j=0; j<theta2[i].length; j++) {
        units3[i] += units2[j] * theta2[i][j];
      }
    }

    const max = Math.max(...units3);
    return units3.findIndex(function(element, index, array){
    	return element == max;
    }) + 1;
  }
}