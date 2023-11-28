const defaultData = {
    "favorites" : {
      "name": [],
      "primary_attr": [],
      "attack_type": [],
      "image": [],
      "attack_rate": [],
      "attack_range": [],
      "base_health": []
    },
    "UI" : {
      "hero": ["Anti-Mage"],
      "attribute": ["str"]
    }
  },
  
    storeName = "amc3047-p1-settings";
    
    const readLocalStorage = () => {
      let allValues = null;
    
      try{
        allValues = JSON.parse(localStorage.getItem(storeName)) || defaultData;
      }catch(err){
        console.log(`Problem with JSON.parse() and ${storeName} !`);
        throw err;
      }
    
      return allValues;
    };
    
    const writeLocalStorage = (allValues) => {
      localStorage.setItem(storeName, JSON.stringify(allValues));
    };
    
    export const clearLocalStorage = () => writeLocalStorage(defaultData);
    
    export const addFavorite = (hName, attribute, attackType, image, attackRate, attackRange, baseHealth) => {
      const allValues = readLocalStorage();
    
      allValues["favorites"].name.push(hName);
      allValues["favorites"].primary_attr.push(attribute);
      allValues["favorites"].attack_type.push(attackType);
      allValues["favorites"].image.push(image);
      allValues["favorites"].attack_rate.push(attackRate);
      allValues["favorites"].attack_range.push(attackRange);
      allValues["favorites"].base_health.push(baseHealth);
      writeLocalStorage(allValues);
    };
  
    export const addHeroToUI = (hero) => {
      const allValues = readLocalStorage();
    
      allValues["UI"].hero.push(hero);
      writeLocalStorage(allValues);
    };
  
    export const addAttributeToUI = (attribute) => {
      const allValues = readLocalStorage();
    
      allValues["UI"].attribute.push(attribute);
      writeLocalStorage(allValues);
    };
  
    export const deleteHeroUI = () => {
      const allValues = readLocalStorage();
    
      allValues["UI"].hero = [];
      writeLocalStorage(allValues);
    };
  
    export const deleteAttributeUI = () => {
      const allValues = readLocalStorage();
    
      allValues["UI"].attribute = [];
      writeLocalStorage(allValues);
    };
  
    export const deleteFavorite = (hName, attribute, attackType, image, attackRate, attackRange, baseHealth) => {
      const allValues = readLocalStorage();
  
      allValues["favorites"].name.splice(hName,1);
      allValues["favorites"].primary_attr.splice(attribute,1);
      allValues["favorites"].attack_type.splice(attackType,1);
      allValues["favorites"].image.splice(image,1);
      allValues["favorites"].attack_rate.splice(attackRate,1);
      allValues["favorites"].attack_range.splice(attackRange,1);
      allValues["favorites"].base_health.splice(baseHealth,1);
      writeLocalStorage(allValues);
    };
    
    export const getFavorites = () => readLocalStorage();
    
    export const clearFavorites = () => {
      const allValues = readLocalStorage();
  
      console.log(allValues.name);
      allValues["favorites"].name = [];
      console.log(allValues.name);
      allValues["favorites"].primary_attr = [];
      allValues["favorites"].attack_type = [];
      allValues["favorites"].image = [];
      allValues["favorites"].attack_rate = [];
      allValues["favorites"].attack_range = [];
      allValues["favorites"].base_health = [];
      writeLocalStorage(allValues);
    };
  
    export const checkIfFavorited = (h1, button) =>
    {
      const favorites = getFavorites();
      for (let i = 0; i < favorites["favorites"].name.length; i++)
      {
        if (favorites["favorites"].name[i] == h1.innerHTML)
        {
          button.disabled = true;
          button.innerHTML = "Favorited!";
        }
      }
    }
    