import { addFavorite, checkIfFavorited } from "./local-storage.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD66sn7baK_SnKY38oYs-QmMFY3sFxjCyw",
  authDomain: "dota-2-api-b5e28.firebaseapp.com",
  projectId: "dota-2-api-b5e28",
  storageBucket: "dota-2-api-b5e28.appspot.com",
  messagingSenderId: "751882973606",
  appId: "1:751882973606:web:0d4dbd86a2f07c450e5f67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
import { getDatabase, ref, set, onValue, increment} from  "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";


const template = document.createElement("template");
template.innerHTML =`
<style>

.box
{
    border-style: double;
    border-color: #95000C;
}

#noborder
{
    border-style: none;
}

</style>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">

<div class = "has-background-danger-dark has-text-black">

    <h1 class = "has-text-centered column is-full is-size-4"></h1>

    <img class = "column is-full" alt="Hero Picture">

    <div class = "box has-background-danger-dark is-shadowless" id = "noborder">
        <div class = "columns is-multiline has-text-centered">
        <div class = "column is-full box has-background-danger-dark has-text-black">
            <pclass = "is-inline-block has-text-centered is-centered"> Primary Attribute: </p>
            <p id = "attribute" class = "is-inline-block has-text-centered is-centered"></p>
        </div>
        <div class = "column is-one-half has-text-centered box has-background-danger-dark has-text-black">
            <p> Attack Type: </p>
            <p id = "attack-type"></p>
        </div>
        <div class = "column is-one-half has-text-centered box has-background-danger-dark has-text-black">
            <p> Base Attack Rate: </p>
            <p id = "attack-rate"></p>
        </div>
        <div class = "column is-one-half has-text-centered box has-background-danger-dark has-text-black">
            <p> Base Attack Range: </p>
            <p id = "attack-range"></p>
        </div>
        <div class = "column is-one-half has-text-centered box has-background-danger-dark has-text-black mb-5">
            <p> Base Health: </p>
            <p id = "hp"></p>
        </div>
        </div>

    </div>
    
    <button class = "button is-primary column is-full">Favorite</button>

</div>
`;

class Herocard extends HTMLElement
{
    constructor()
    {
        super();

        this.attachShadow({mode: "open"});

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.h1 = this.shadowRoot.querySelector("h1");
        this.img = this.shadowRoot.querySelector("img");
        this.p1 = this.shadowRoot.querySelector("#attribute");
        this.p2 = this.shadowRoot.querySelector("#attack-type");
        this.button = this.shadowRoot.querySelector("button");
        this.p3 = this.shadowRoot.querySelector("#attack-rate");
        this.p4 = this.shadowRoot.querySelector("#attack-range");
        this.p5 = this.shadowRoot.querySelector("#hp");
    }

    connectedCallback()
    {
        checkIfFavorited(this.h1, this.button);
        
        this.button.onclick = (evt) =>
        {
            console.log(this.h1.innerHTML)
            addFavorite(this.h1.innerHTML, this.p1.innerHTML, this.p2.innerHTML, this.img.src, this.p3.innerHTML, this.p4.innerHTML, this.p5.innerHTML);
            evt.target.innerHTML = "Favorited!";
            evt.target.disabled = true;

            this.firebase (this.h1.innerHTML, this.p2.innerHTML, this.p1.innerHTML, this.img.src, this.p3.innerHTML, this.p4.innerHTML, this.p5.innerHTML);        
    
        }
        this.render();
    }

    disconnectedCallback()
    {

    }

    firebase (heroName, attackType, attribute, imageUrl, attackRate, attackRange, hp)
    {
        const db = getDatabase();

        set(ref(db, 'Favorites/' + heroName), {
            Name: heroName,
            FavoriteNumber: increment(1),
            AttackType: attackType,
            Attribute: attribute,
            ImageUrl: imageUrl,
            AttackRate: attackRate,
            AttackRange: attackRange,
            Hp: hp
        });
    }

    attributeChangedCallback(attributeName, oldVal, newVal)
    {
        console.log(attributeName, oldVal, newVal);
        this.render();
    }

    static get observedAttributes()
    {
        return ["data-name", "data-attacktype", "data-attribute", "data-attackrate", "data-image", "data-attackrange", "data-hp"];
    }

    render()
    {
       const name = this.getAttribute("data-name") ? this.getAttribute("data-name") : "<i>...hero name...</i>";
       const attackType = this.getAttribute("data-attacktype") ? this.getAttribute("data-attacktype") : "Melee";
       const attribute = this.getAttribute("data-attribute") ? this.getAttribute("data-attribute") : "agi";
       const imageUrl = this.getAttribute("data-image") ? this.getAttribute("data-image") : "images/catimage-no-image.png";
       const attackRate = this.getAttribute("data-attackrate") ? this.getAttribute("data-attackrate") : "0";
       const attackRange = this.getAttribute("data-attackrange") ? this.getAttribute("data-attackrange") : "0";
       const hp = this.getAttribute("data-hp") ? this.getAttribute("data-hp") : "0";

       this.h1.innerHTML = name;
       this.p1.innerHTML = `${attribute}`;
       this.p2.innerHTML = `${attackType}`;
       this.img.src = imageUrl;
       this.p3.innerHTML = `${attackRate}`;
       this.p4.innerHTML = `${attackRange}`;
       this.p5.innerHTML = `${hp}`;
    }
}
customElements.define("hero-card", Herocard);