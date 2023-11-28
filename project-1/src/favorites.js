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
  import { getDatabase, ref, set, increment} from  "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";

import { deleteFavorite, getFavorites } from "./local-storage.js";

import * as storage from "./local-storage.js";
import "./favorites-card.js";

const columns = document.querySelector("#column-manager");

const showFavorites = () => {
  let favorites = storage.getFavorites();


  for (let i = 0; i < favorites["favorites"].name.length; i++)
  {
    showFavorite({name: `${favorites["favorites"].name[i]}`,attribute: `${favorites["favorites"].primary_attr[i]}`,attacktype: `${favorites["favorites"].attack_type[i]}`, image: `${favorites["favorites"].image[i]}`,attackrate: `${favorites["favorites"].attack_rate[i]}`,attackrange: `${favorites["favorites"].attack_range[i]}`,hp: `${favorites["favorites"].base_health[i]}` })
  }
};

const showFavorite = heroObj =>
{
    const favoriteCard = document.createElement("favorites-card");
    favoriteCard.dataset.name = heroObj.name ?? "no name found";
    favoriteCard.dataset.attribute = heroObj.attribute ?? "?";
    favoriteCard.dataset.attacktype = heroObj.attacktype ?? "?";
    favoriteCard.dataset.image = heroObj.image ?? "";
    favoriteCard.dataset.attackrate = heroObj.attackrate ?? "None";
    favoriteCard.dataset.attackrange = heroObj.attackrange ?? "None";
    favoriteCard.dataset.hp = heroObj.hp ?? "None";
    favoriteCard.setAttribute("class", "column is-one-third");
    columns.appendChild(favoriteCard);
};

function firebase (heroName, attackType, attribute, imageUrl, attackRate, attackRange, hp)
{
    const db = getDatabase();

    set(ref(db, 'Favorites/' + heroName), {
        Name: heroName,
        FavoriteNumber: increment(-1),
        AttackType: attackType,
        Attribute: attribute,
        ImageUrl: imageUrl,
        AttackRate: attackRate,
        AttackRange: attackRange,
        Hp: hp
    });
}

const lowerFavNumbers = () => 
  {
    let favorites = storage.getFavorites();


    for (let i = 0; i < favorites["favorites"].name.length; i++)
    {
      firebase(favorites["favorites"].name[i], favorites["favorites"].attack_type[i], favorites["favorites"].primary_attr[i], favorites["favorites"].image[i], favorites["favorites"].attack_rate[i], favorites["favorites"].attack_range[i], favorites["favorites"].base_health[i]);
    }
  }

const init = () => {
  showFavorites();

  /* Event Handlers */
  document.querySelector("#btn-clear-favorites").onclick = () => {
    lowerFavNumbers();
    storage.clearFavorites();
    document.location.reload(true);
  };
};

init();