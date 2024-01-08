import * as audio from './audio.js';
import * as fetch from "./fetch.js";

let ctx,analyserNode,audioData;

const DEFAULTS = Object.freeze({
	sound1  :  "audio/The Only Thing I Know for Real - Maniac Agenda Mix.mp3",
  sound2 : "audio/no more kings - critical hit.mp3",
  sound3 : "audio/TheFatRat-Arcadia.mp3"
});

const columns = document.querySelector("#control-manager");
const canvas = document.querySelector("#canvas");
//const canvasWidth = 800, canvasHeight = 600;

let width = canvas.offsetWidth; // Width of the scene
let height = canvas.offsetHeight; // Height of the scene

let x = .01, y = 0, z = 0;
let a = 10, b = 28, c = 8/3;
let scale = 8;
let counter = 0;
let counter2 = 1;
let rotation;
let points = {};
let currentIndex = 0;
const numPoints = 3000;
let xButton, yButton, zButton, xOperationButton, yOperationButton, zOperationButton;
let url = "data/controls.json";
let rotationSlider = document.querySelector('#rotationSlider');

window.onload = init;

function init(){

    audio.setupWebaudio(DEFAULTS.sound3);
    ctx = canvas.getContext("2d");

    // keep a reference to the analyser node
	  analyserNode = audio.analyserNode;
	
    // this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize/2);

    fetch.loadJsonFetch(url,setupUI);
    loop();
}


const createControls = comObj =>
{
    const controls = document.createElement("my-controls");
    controls.dataset.playpause = comObj.playpause ?? "N/A";
    controls.dataset.tracks = comObj.tracks ?? "...None...";
    controls.dataset.vslider = comObj.vslider ?? "?";
    controls.dataset.vlabel = comObj.vlabel ?? "?";
    controls.dataset.xon = comObj.xon ?? "?";
    controls.dataset.yon = comObj.yon ?? "?";
    controls.dataset.zon = comObj.zon ?? "?";
    controls.dataset.xoperation = comObj.xoperation ?? "?";
    controls.dataset.yoperation = comObj.yoperation ?? "?";
    controls.dataset.zoperation = comObj.zoperation ?? "?";
    controls.setAttribute("class", "column is-full");
    columns.appendChild(controls);
};


function loop()
{
    requestAnimationFrame(loop);
  
    ctx.fillRect(0,0,canvas.width,canvas.height); // clear the screen
    analyserNode.getByteFrequencyData(audioData);
    counter2 += 1;
    counter += .1;
    rotation = rotationSlider.value * (Math.PI * 2) / 360.0;

    if (counter > 360) counter = 0;

    let dt = .01;

    let dx = (a * (y-x)) * dt;
    let dy = (x * (b-z) - y) * dt;
    let dz = (x * y - c * z) * dt;

    x = x + dx;
    y = y + dy;
    z = z + dz;

    let previousX = x;
    let previousY = y;
    let previousZ = z;

    //switch statements that check the state the controls are in and effect the 
    //attractor according to the current state
    if (xButton)
    {
      switch (xOperationButton.innerHTML)
      {
        case "Subtract":
          if (xButton.value == "on")
          {
            for (let i = 0; i < audioData.length / 2; i++)
            {
              let percent = audioData[i] / 255;
              x -= percent * 2;
            }
          }
        break;

        case "Add":
          if (xButton.value == "on")
          {
            for (let i = 0; i < audioData.length / 2; i++)
            {
              let percent = audioData[i] / 255;
              x += percent * 2;
            }
          }
        break;
      }

      switch (yOperationButton.innerHTML)
      {
        case "Subtract":
          if (yButton.value == "on")
          {
            for (let i = 0; i < audioData.length / 2; i++)
            {
              let percent = audioData[i] / 255;
              y -= percent / 2;
            }
          }
        break;

        case "Add":
          if (yButton.value == "on")
          {
            for (let i = 0; i < audioData.length / 2; i++)
            {
              let percent = audioData[i] / 255;
              y += percent / 2;
            } 
          }
        break;
      }

      switch (zOperationButton.innerHTML)
      {
        case "Subtract":
          if (zButton.value == "on")
          {
            for (let i = 0; i < audioData.length / 2; i++)
            {
              let percent = audioData[i] / 255;
              z -= percent * 2;
            }
          }
        break;

        case "Add":
          if (zButton.value == "on")
          {
            for (let i = 0; i < audioData.length / 2; i++)
            {
              let percent = audioData[i] / 255;
              z += percent * 2;
            }
          }
        break;
      }
    }
    
    points[currentIndex++ % numPoints] = { 'x' : x, 'y' : y, 'z' : z, 'color' : `hsl(${counter}, 100%, 50%)` };
    

    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);

    //Taken from a project Tony sent me, Thanks
    for (let i = 0; i < Math.min(currentIndex, numPoints); i++)
    {
      ctx.fillStyle = points[i].color;
      ctx.fillRect(rotateAroundY(points[i].x, points[i].z, rotation, scale), points[i].y * scale,2,2);
    }

    ctx.restore();

    x = previousX;
    y = previousY;
    z = previousZ;
}

//Taken from a project Tony sent me, Thanks
function rotateAroundY(x, z, rot, scale){
  return (Math.cos(rot) * (x + scale) + Math.sin(rot) * (z - 5 * scale)) * scale;
}


// Function called right after user resized its screen
function onResize () {
    // We need to define the dimensions of the canvas to our canvas element
    // Javascript doesn't know the computed dimensions from CSS so we need to do it manually
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    
    // If the screen device has a pixel ratio over 1
    // We render the canvas twice bigger to make it sharper (e.g. Retina iPhone)
    if (window.devicePixelRatio > 1) {
      canvas.width = canvas.clientWidth * 2;
      canvas.height = canvas.clientHeight * 2;
    } else {
      canvas.width = width;
      canvas.height = height;
    }
  }
  
  // Listen to resize events
  window.addEventListener('resize', onResize);
  // Make sure the canvas size is perfect
  onResize();


  //Sets up the my-controls web-component
  const setupUI = json =>
  {
    createControls({playpause: `${json.playButton}`, tracks: `<option value= "${json.tracks.one}" selected>The Only Thing I Know for Real - Maniac Agenda Mix</option>
    <option value="${json.tracks.two}" selected>no more kings - critical hit</option>
    <option value="${json.tracks.three}" selected>Arcadia-TheFatRat</option>`, 
    vslider:  json.vSlider, vlabel: json.vLabel, xon: json.xOn, yon: json.yOn, zon: json.zOn, xoperation: json.xOperation, yoperation: json.yOperation, zoperation: json.zOperation});
  } 

  //sets all of the controls from the my-controls web-component to their own variables
  function acquireControls()
  {
    xButton = document.querySelector('my-controls').shadowRoot.querySelector('#xButton');
    yButton = document.querySelector('my-controls').shadowRoot.querySelector('#yButton');
    zButton = document.querySelector('my-controls').shadowRoot.querySelector('#zButton');

    xOperationButton = document.querySelector('my-controls').shadowRoot.querySelector('#xOperationButton');
    yOperationButton = document.querySelector('my-controls').shadowRoot.querySelector('#yOperationButton');
    zOperationButton = document.querySelector('my-controls').shadowRoot.querySelector('#zOperationButton');
  }

  //this exicutes the aquirecontrols function after the my-controls element
  //has been made on the page so we dont run into errors
  setTimeout(acquireControls,1000);
  

  



  
