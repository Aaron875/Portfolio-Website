
    "use strict";
    
      window.onload = init;
      
      function init(){
          document.querySelector("#search").onclick = getData;
      }
      
      let day = "";
      let genre = "";
      let maxSearch = "";
  
      function getData(){
          // main entry point to web service
          const SERVICE_URL = "https://api.jikan.moe/v4";
          
          // No API Key required!
          
          // build up our URL string
          let url = SERVICE_URL;
          
          //sets the variables values based on what the user has selected
          day = document.querySelector("#days").value;
  
          genre = document.querySelector('input[name="genre"]:checked').value
  
          maxSearch = document.querySelector("#searches").value
          
          // encode spaces and special characters
          day = encodeURIComponent(day);
          
          //if alldays is selected then the api gets the entire schedule and if any specific day is selected
          //then the api gets the schedule for that specific day
          if (day == "AllDays")
          {
            url += "/schedules" 
          }
          else
          {
            url += "/schedules/" + day;
          }
          
          
          //update the UI
          document.querySelector("#debug").innerHTML = `<b>Querying web service with:</b> <a href="${url}" target="_blank">${url}</a>`;
          
          //create a new XHR object
          let xhr = new XMLHttpRequest();
  
          //set the onload handler
          xhr.onload = dataLoaded;
      
          //set the onerror handler
          xhr.onerror = dataError;
  
          //open connection and send the request
          xhr.open("GET",url);
          xhr.send();
      }
      
      function dataError(e){
          console.log("An error occurred");
      }
      
      function dataLoaded(e){
          //e.target is the xhr object
          let xhr = e.target;
          
          document.querySelector("#debug").innerHTML = `<b>Searching</b>`;
      
          //xhr.responseText is the JSON file we just downloaded
          console.log(xhr.responseText);
      
          //turn the text into a parsable JavaScript object
          let obj = JSON.parse(xhr.responseText);
          
          //if there are no results, print a message and return
          if(obj.error){
              let msg = obj.error;
              document.querySelector("#content").innerHTML = `<p><i>Problem! <b>${msg}</b></i></p>`;
              return; // Bail out
          }
          
  
          //if there is an array of results, loop through them
          // this is a weird API, the name of the key is the day of the week you asked for
          let results = [];

          for (let i = 0; i < obj.data.length; i++)
          {
            results.push(obj.data[i])
        
          }
          

          //if alldays is selected then the array of results will be filled with the results from everyday
        //   if (day == "AllDays")
        //   {
        //     let allDays = results.concat(obj["monday"],obj["tuesday"],obj["wednesday"],obj["thursday"],obj["friday"],obj["saturday"],obj["sunday"]);
        //     results = allDays;
        //   }
        //   else
        //   {
        //     results = obj[day];
        //   }

          if(!results){
              document.querySelector("#content").innerHTML = `<p><b>No results found</b></i></p>`;
              return;
          }
  
          //looks through all of the results and delets all of the results that dont have the correct genre 
          let num = 0;
          let integer = parseInt(genre, 10);
  
          for (let i=0; i < results.length;i++){
  
              let allgenres = [];
              for (let j = 0; j < results[i].genres.length; j++)
              {
                  allgenres.push(results[i].genres[j].mal_id);
              }
  
              if (allgenres.includes(integer) == false) 
              {
                  delete results[i];
                  num++;
              }             
          }
  
          let maxSearchValue = parseInt(maxSearch,10);
  
          //removes all of the nulls that the previous loop left inside of the array
          let int = results.length;
          let number = 0;
          for (let i = 0; i < int; i++)
          {
              if (results[i-number] == null)
              {
                  results.splice(i-number,1)
                  number++;
              }
          }
  
          //removes all results when the maxsearch value is greater that the number of results in the array
          while (results.length > maxSearchValue)
          {
              results.pop();
          }
          
          //put together HTML
          let numresults = `<p id = 'numresults'>Here are <b>${results.length}</b> results!</p>`; // ES6 String Templating
          let allinfo = "";
  
          
          for (let i=0;i<results.length;i++){
  
              if (results[i] != null)
              {
                  let result = results[i];
                  let url = result.url;
                  let title = result.title;
                  let synopsis = result.synopsis;

                  if (!synopsis)
                  {
                    synopsis = "No synopsis found"
                  }


                  let imgurl = result.images.jpg.image_url;
                  let allgenres = [];
                  for (let j = 0; j < results[i].genres.length; j++)
                  {
                      allgenres.push(results[i].genres[j].name)
                  }
  
                  allinfo += `<div id = 'infofor1'><img class = 'images' src = '${imgurl}' alt = '${title}'/><br><div id = 'allbutimg'><a href='${url}'>${title}</a>`
   
                  allinfo += `<h4><u>Genres</u></h4><span id = 'allgenres'>${allgenres} </span><br><h4><u>Synopsis</u></h4><span id = 'synopsis'>${synopsis}</span></div></div><br><br>`;
              }
          }
          
          //display final results to user
          document.querySelector("#data").innerHTML = numresults;
          document.querySelector("#allinfo").innerHTML = allinfo;
          document.querySelector("#debug").innerHTML = `<b>Search Successful</b>`;
  
          
      }	