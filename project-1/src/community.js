import "./community-card.js";

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
import { getDatabase, ref, onValue} from  "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";

let pageReset = false;
const columns = document.querySelector("#column-manager");

const showHero = comObj =>
{
    const cummunityCard = document.createElement("community-card");
    cummunityCard.dataset.name = comObj.name ?? "no name found";
    cummunityCard.dataset.numfavorites = comObj.numfavorites ?? "no favorites";
    cummunityCard.dataset.attribute = comObj.attribute ?? "?";
    cummunityCard.dataset.attacktype = comObj.attacktype ?? "?";
    cummunityCard.dataset.image = comObj.image ?? "";
    cummunityCard.dataset.attackrate = comObj.attackrate ?? "None";
    cummunityCard.dataset.attackrange = comObj.attackrange ?? "None";
    cummunityCard.dataset.hp = comObj.hp ?? "None";
    cummunityCard.setAttribute("class", "column is-one-third");
    columns.appendChild(cummunityCard);
};

const favoritesChanged = (snapshot) => {
  snapshot.forEach(fav => {
    
    const childData = fav.val();
    showHero({name: `${childData.Name}`,numfavorites: `${childData.FavoriteNumber}`,attribute: `${childData.Attribute}`,attacktype: `${childData.AttackType}`, image: `${childData.ImageUrl}`,attackrate: `${childData.AttackRate}`,attackrange: `${childData.AttackRange}`,hp: `${childData.Hp}` });
  });
  if (pageReset == true)
  {
    document.location.reload(true);
  }
  pageReset = true;
};


showCards();

function showCards()
{
  const db = getDatabase();

  const favoritesRef = ref(db, 'Favorites/' );

  onValue(favoritesRef,favoritesChanged);

}

