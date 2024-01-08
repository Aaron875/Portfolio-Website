import * as audio from './audio.js';

const template = document.createElement("template");
template.innerHTML =`

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">


<div class="columns is-multiline has-text-centered mt-3">

  <section class = "column is-full">
    <div class = "button is-info" id="playButton" data-playing="no">Play</div>
  </section>

  <section class = "column is-full">
    <label class = "has-text-danger-dark">Track: 
      <select id="trackSelect">
      </select>
    </label>
  </section>

</div>

  <h1 class = "is-size-4 has-text-centered has-text-danger-dark">Use these controls to add or subtract from the Lorenz Attractors <br> X, Y, and Z coordinate
  values respectively
  </h1>

<div class="columns is-multiline has-text-centered mt-3">

  <section class = "column is-one-third">
    <label class = "has-text-danger-dark">X Select: 
      <input type="checkbox" id="xButton">
    </label>
  </section>

  <section class = "column is-one-third">
  <label class = "has-text-danger-dark">Y Select: 
    <input type="checkbox" id="yButton">
  </label>
  </section>

  <section class = "column is-one-third">
  <label class = "has-text-danger-dark">Z Select: 
    <input type="checkbox" id="zButton">
  </label>
  </section>



  <section class = "column is-one-third">
    <div class = "button is-info" id="xOperationButton" data-operation="add">Subtract</div>
  </section>

  <section class = "column is-one-third">
    <div class = "button is-info" id="yOperationButton" data-operation="add">Subtract</div>
  </section>

  <section class = "column is-one-third">
    <div class = "button is-info" id="zOperationButton" data-operation="add">Subtract</div>
  </section>



  <section class = "column is-full">
  <label class = "has-text-danger-dark"> Volume: 
  <input type="range" id="volumeSlider" min="0" max="2" step="0.01">
  </label>
    <span class = "has-text-danger-dark" id="volumeLabel">???</span>
  </section>

</div>
`;

class MyControls extends HTMLElement
{
    constructor()
    {
        super();

        this.attachShadow({mode: "open"});

        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.playButton = this.shadowRoot.querySelector("#playButton");
        this.trackSelect = this.shadowRoot.querySelector("#trackSelect");
        this.volumeSlider = this.shadowRoot.querySelector("#volumeSlider");
        this.volumeLabel = this.shadowRoot.querySelector("#volumeLabel");

        this.xButton = this.shadowRoot.querySelector("#xButton");
        this.yButton = this.shadowRoot.querySelector("#yButton");
        this.zButton = this.shadowRoot.querySelector("#zButton");


        this.xOperationButton = this.shadowRoot.querySelector("#xOperationButton");
        this.yOperationButton = this.shadowRoot.querySelector("#yOperationButton");
        this.zOperationButton = this.shadowRoot.querySelector("#zOperationButton");
    }

    connectedCallback()
    {


      this.volumeSlider.dispatchEvent(new Event("input"));

      this.volumeSlider.oninput = e => {
        this.volumeControls(e);
      }

      this.trackSelect.onchange = e => {
        this.trackButtonControls(e);
      }

      this.playButton.onclick = e => {
        this.playButtonControls(e);
      }

      //All of the cordinate checkboxes button controls
      this.xButton.onclick = e => {
        this.selectionButtonControls(e);
      }

      this.yButton.onclick = e => {
        this.selectionButtonControls(e);
      }

      this.zButton.onclick = e => {
        this.selectionButtonControls(e);
      }

      //All of the add/subtract button controls
      this.xOperationButton.onclick = e => {
        this.operationButtonControls(e);
      }

      this.yOperationButton.onclick = e => {
        this.operationButtonControls(e);
      }

      this.zOperationButton.onclick = e => {
        this.operationButtonControls(e);
      }

      this.render();
    }


    playButtonControls(e)
    {
      console.log(`audioCtx.state before = ${audio.audioCtx.state}`);
    
      // check if context is in suspended state (autoplay policy)
      if (audio.audioCtx.state == "suspended")
      {
        audio.audioCtx.resume();
      }
      console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    
      // if track is paused then start it
      if (e.target.dataset.playing == "no")
      {
        audio.playCurrentSound();
        e.target.dataset.playing = "yes"; // Our CSS will set the text to pause
        e.target.innerHTML = "Pause";
      }
      // if track is playing then pause it
      else
      {
        audio.pauseCurrentSound();
        e.target.dataset.playing = "no";
        e.target.innerHTML = "Play";
      }
    }

    operationButtonControls(e)
    {
      console.log(e.target.dataset.operation);
      if (e.target.dataset.operation == "subtract")
      {
        e.target.dataset.operation = "add";
        e.target.innerHTML = "Subtract";
      }
      else
      {
        e.target.dataset.operation = "subtract";
        e.target.innerHTML = "Add";
      }
      console.log(e.target.dataset.operation);
    }

    selectionButtonControls(e)
    {
      console.log(e.target.value);
      if (e.target.value == "on")
      {
        e.target.value = "off";
      }
      else
      {
        e.target.value = "on";
      }
      console.log(e.target.value);
    }

    volumeControls(e)
    {
      // set gain
      audio.setVolume(e.target.value);
      // update the lable to new value
      this.volumeLabel.innerHTML = Math.round(e.target.value / 2 * 100);
    }

    trackButtonControls(e)
    {
      audio.loadSoundFile(e.target.value);
  
      // pause if current track is playing
      if (this.playButton.dataset.playing == "yes")
      {
        
        this.playButton.dispatchEvent(new MouseEvent("click"));
      } 
    }

    attributeChangedCallback(attributeName, oldVal, newVal)
    {
      console.log(attributeName, oldVal, newVal);
      this.render();
    }

    static get observedAttributes()
    {
        return ["data-playpause", "data-tracks", "data-vslider", "data-vlabel", "data-xon", "data-yon", "data-zon", "data-xoperation", "data-yoperation", "data-zoperation"];
    }

    render()
    {
       const playButton = this.getAttribute("data-playpause") ? this.getAttribute("data-playpause") : "<i>Play</i>";
       const tracks = this.getAttribute("data-tracks") ? this.getAttribute("data-tracks") : `<option value="audio/The Only Thing I Know for Real - Maniac Agenda Mix.mp3" selected>The Only Thing I Know for Real - Maniac Agenda Mix</option>`;
       const volumeSlider = this.getAttribute("data-vslider") ? this.getAttribute("data-vslider") : "0.5";
       const volumeLabel = this.getAttribute("data-vlabel") ? this.getAttribute("data-vlabel") : "???";

       const xButton = this.getAttribute("data-xon") ? this.getAttribute("data-xon") : "off";
       const yButton = this.getAttribute("data-yon") ? this.getAttribute("data-yon") : "off";
       const zButton = this.getAttribute("data-zon") ? this.getAttribute("data-zon") : "off";


       const xOperationButton = this.getAttribute("data-xoperation") ? this.getAttribute("data-xoperation") : "<i>Subtract</i>";
       const yOperationButton = this.getAttribute("data-yoperation") ? this.getAttribute("data-yoperation") : "<i>Subtract</i>";
       const zOperationButton = this.getAttribute("data-zoperation") ? this.getAttribute("data-zoperation") : "<i>Subtract</i>";

       this.playButton.innerHTML = playButton;
       this.trackSelect.innerHTML = tracks;
       this.volumeSlider.value = volumeSlider;
       this.volumeLabel.innerHTML = volumeLabel;

       this.xButton.value = xButton;
       this.yButton.value = yButton;
       this.zButton.value = zButton;

       this.xOperationButton.innerHTML = xOperationButton;
       this.yOperationButton.innerHTML = yOperationButton;
       this.zOperationButton.innerHTML = zOperationButton;
    }

}
customElements.define("my-controls", MyControls);