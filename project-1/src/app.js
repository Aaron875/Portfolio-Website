import "./hero-card.js";
import { addHeroToUI, addAttributeToUI, deleteHeroUI, deleteAttributeUI, getFavorites } from "./local-storage.js";
import * as fetch from "./fetch.js";

const columns = document.querySelector("#column-manager");
const str = document.querySelector("#strength");
const agi = document.querySelector("#agility");
const int = document.querySelector("#intelligence");
const nameSearch = document.querySelector("#name-search");
const url = "https://api.opendota.com/api/heroStats";
const search = document.querySelector("#search");

let attribute;

loadUI();

function loadUI ()
{
    const data = getFavorites();


    nameSearch.value = data["UI"].hero[0];

    switch(data["UI"].attribute[0])
    {
        case "agi":
            agi.checked = true;
            break;

        case "str":
            str.checked = true;
            break;

        case "int":
            int.checked = true;
            break;
    }
}

const showHero = heroObj =>
{
    const heroCard = document.createElement("hero-card");
    heroCard.dataset.name = heroObj.name ?? "no name found";
    heroCard.dataset.attribute = heroObj.attribute ?? "?";
    heroCard.dataset.attacktype = heroObj.attacktype ?? "?";
    heroCard.dataset.image = heroObj.image ?? "";
    heroCard.dataset.attackrate = heroObj.attackrate ?? "None";
    heroCard.dataset.attackrange = heroObj.attackrange ?? "None";
    heroCard.dataset.hp = heroObj.hp ?? "None";
    heroCard.setAttribute("class", "column is-one-third");
    columns.appendChild(heroCard);
};

search.onclick = searchClicked;

function searchClicked ()
{
    search.setAttribute("class", "button is-large is-success is-loading");
    fetch.loadJsonFetch(url,dataLoaded);

    if (nameSearch.value != "")
    {
        deleteHeroUI();
        addHeroToUI(nameSearch.value);
    }

    deleteAttributeUI();

    if(agi.checked == true)
    {
        addAttributeToUI("agi")
    }
    else if(str.checked == true)
    {

        addAttributeToUI("str")
    }
    else if(int.checked == true)
    {
        addAttributeToUI("int")
    }
} 


const dataLoaded = json => 
{
    columns.innerHTML = "";
    const attributeImg = document.createElement("img");

    for (let h of json)
    {
        if (nameSearch.value == h.localized_name)
        {
            switch(h.primary_attr)
            {
                case "agi":
                    attributeImg.src = "./images/alexandra-bisson-002-agi.jpg";
                    break;

                case "str":
                    attributeImg.src = "./images/alexandra-bisson-001-str.jpg";
                    break;

                case "int":
                    attributeImg.src = "./images/alexandra-bisson-003-int.jpg";
                    break;
            }

            showHero({name: `${h.localized_name}`,attribute: `<img class = "image is-64x64 is-centered" src="${attributeImg.src}">`,attacktype: `${h.attack_type}`, image: `http://cdn.dota2.com${h.img}`,attackrate: `${h.attack_rate}`,attackrange: `${h.attack_range}`,hp: `${h.base_health}` })
        }
    }

    if (columns.innerHTML.trim() == "")
    {
        for (let h of json)
        {
            if (str.checked && h.primary_attr == "str")
            {
                showHero({name: `${h.localized_name}`,attribute: `<img class = "image is-64x64 is-rounded has-text-centered" src="./images/alexandra-bisson-001-str.jpg">`,attacktype: `${h.attack_type}`, image: `http://cdn.dota2.com${h.img}`,attackrate: `${h.attack_rate}`,attackrange: `${h.attack_range}`,hp: `${h.base_health}` })
            }
            else if (agi.checked && h.primary_attr == "agi")
            {
                showHero({name: `${h.localized_name}`,attribute: `<img class = "image is-64x64 is-rounded has-text-centered" src="./images/alexandra-bisson-002-agi.jpg">`,attacktype: `${h.attack_type}`, image: `http://cdn.dota2.com${h.img}`,attackrate: `${h.attack_rate}`,attackrange: `${h.attack_range}`,hp: `${h.base_health}` })
            }
            else if (int.checked && h.primary_attr == "int")
            {
                showHero({name: `${h.localized_name}`,attribute: `<img class = "image is-64x64 is-rounded has-text-centered" src="./images/alexandra-bisson-003-int.jpg">`,attacktype: `${h.attack_type}`, image: `http://cdn.dota2.com${h.img}`,attackrate: `${h.attack_rate}`,attackrange: `${h.attack_range}`,hp: `${h.base_health}` })
            }
        }
    }
    search.setAttribute("class", "button is-large is-success");
}

/*
function loadJsonXHR()
{
    columns.innerHTML = "";
	const url = "https://api.opendota.com/api/heroStats";
	const xhr = new XMLHttpRequest();
	xhr.onload = (e) => 
    {
		console.log(`In onload - HTTP Status Code = ${e.target.status}`);
		let json;
		try
        {
			json = JSON.parse(e.target.responseText);
		}
        catch
        {
			document.querySelector("#output").innerHTML = "<p>BAD JSON!</p>";
			return;
		}

        const attributeImg = document.createElement("img");

        for (let h of json)
        {
            if (nameSearch.value == h.localized_name)
            {
                switch(h.primary_attr)
                {
                    case "agi":
                        attributeImg.src = "./images/alexandra-bisson-002-agi.jpg";
                        break;

                    case "str":
                        attributeImg.src = "./images/alexandra-bisson-001-str.jpg";
                        break;

                    case "int":
                        attributeImg.src = "./images/alexandra-bisson-003-int.jpg";
                        break;
                }

                showHero({name: `${h.localized_name}`,attribute: `<img class = "image is-64x64 is-centered" src="${attributeImg.src}">`,attacktype: `${h.attack_type}`, image: `http://cdn.dota2.com${h.img}`,attackrate: `${h.attack_rate}`,attackrange: `${h.attack_range}`,hp: `${h.base_health}` })
            }
        }

        if (columns.innerHTML.trim() == "")
        {
            for (let h of json)
            {
                if (str.checked && h.primary_attr == "str")
                {
                    showHero({name: `${h.localized_name}`,attribute: `<img class = "image is-64x64 is-rounded has-text-centered" src="./images/alexandra-bisson-001-str.jpg">`,attacktype: `${h.attack_type}`, image: `http://cdn.dota2.com${h.img}`,attackrate: `${h.attack_rate}`,attackrange: `${h.attack_range}`,hp: `${h.base_health}` })
                }
                else if (agi.checked && h.primary_attr == "agi")
                {
                    showHero({name: `${h.localized_name}`,attribute: `<img class = "image is-64x64 is-rounded has-text-centered" src="./images/alexandra-bisson-002-agi.jpg">`,attacktype: `${h.attack_type}`, image: `http://cdn.dota2.com${h.img}`,attackrate: `${h.attack_rate}`,attackrange: `${h.attack_range}`,hp: `${h.base_health}` })
                }
                else if (int.checked && h.primary_attr == "int")
                {
                    showHero({name: `${h.localized_name}`,attribute: `<img class = "image is-64x64 is-rounded has-text-centered" src="./images/alexandra-bisson-003-int.jpg">`,attacktype: `${h.attack_type}`, image: `http://cdn.dota2.com${h.img}`,attackrate: `${h.attack_rate}`,attackrange: `${h.attack_range}`,hp: `${h.base_health}` })
                }
            }
        }

		console.log("json = ",json);
	}
	xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
	xhr.open("GET",url);
	xhr.send();
}
*/