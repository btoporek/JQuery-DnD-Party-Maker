fetch("https://63b347155901da0ab37bb978.mockapi.io/api/dndpartymaker/party")
  .then((res) => res.json())
  .then((data) => console.log(data));

/*Party Class
-name
-method for adding characters
*/
class Party {
  constructor() {
    this.name = $("#new-party-name").val();
    this.characters = [];
  }
  addCharacter(name, race, dndClass, alignment) {
    characters.push(new Character(name, race, dndClass, alignment));
  }
}

class Character {
  constructor(name, race, dndClass, alignment) {
    this.name = name;
    this.race = race;
    this.dndClass = dndClass;
    this.alignment = alignment;
  }
}

/* Service Class for API requests
-variable to reference API url
-method to get/render all party info 
-method to get id of party
-method to create party
-method to update party info
-method to delete party
*/

class partyService {
  static url =
    "https://63b347155901da0ab37bb978.mockapi.io/api/dndpartymaker/party"; // add MOCK API url here

  static getAllParties() {
    //static method to return/request data from the above url using ajax get (GET - Requests data from a specified resource)
    return $.get(this.url);
  }

  static getParty(id) {
    //static method to get the id of the party from the api url
    return $.get(this.url + `/${id}`);
  }

  static getPartyCharacters(id) {
    //static method to get the id of the party from the api url
    //let data = $.get(this.url + `/${id}/characters`);
    // return data;

    let data = $.ajax({
      type: "GET",
      url: this.url + `/${id}`,
      dataType: "json",
    });
    return data;
  }

  static createParty(party) {
    //static method to return the data (using ajax post [POST - Submits data to be processed to a specified resource]) from the url when creating a party (see create partyfunction in DOM class)
    return $.post(this.url, party);
  }

  static updateParty(party) {
    {
    }
    /*static method to update party information in the api using ajax method (The ajax() method is used to perform an AJAX (asynchronous HTTP) request. All jQuery AJAX methods use the ajax() method. This method is mostly used for requests where the other methods cannot be used.) */
    return $.ajax({
      url: this.url + `/${party._id}`, //returns url with the party id from the API
      dataType: "json", //requests data to be in JSON
      data: JSON.stringify(party), //returns data as a string
      contentType: "application/json", //specifies content type (The Content-Type representation header is used to indicate the original media type of the resource (prior to any content encoding applied for sending).)
      type: "PUT", //PUT is used to send data to a server to create/update a resource. The difference between POST and PUT is that PUT requests are idempotent. That is, calling the same PUT request multiple times will always produce the same result
    });
  }

  static deleteParty(id) {
    //static method to return the data for deleting a party (actual delete function is below in DOM class)
    return $.ajax({
      url: this.url + `/${id}`, //uses url with the id from API
      type: "DELETE", //specifics operation as delete
    });
  }
}

/* DOMManager class
-variable to reference all parties in class
-method to call getting all party info
-method to create party
-method to delete party
-method to create characters (reference DnD APIs here?)
-method to delete characters
-method to render all data with html code (reference DnD APIs here?)
*/
class DOMManager {
  static parties;

  static getAllParties() {
    //method to call getAllparties method in service and renders them to the DOM
    partyService.getAllParties().then((parties) => this.render(parties));
    //calls Party Service class with the static getAllparties property and the then response to the promise to return the parties (the callback function in then refers to a method listed below called "render" to re-render the DOM)
  }

  static displayParties() {
    partyService.getAllParties().then((parties) => this.display(parties));
  }

  static createParty(name) {
    //static method to create a new party using party Service class and properties
    partyService
      .createParty(new Party(name))
      .then(() => {
        return partyService.getAllParties(); //then response to promist to return getAllparties method
      })
      .then((parties) => this.render(parties)); //then response to promise to return parties in this class and calls below render method
  }

  static deleteParty(id) {
    partyService
      .deleteParty(id)
      .then(() => {
        return partyService.getAllParties(); //then response to promise that accesses method to return all parties/render all data to the API
      })
      .then((parties) => this.render(parties)); //then response to promise that returns the parties in this class and calls render method below
  }

  static deletePartyInDisplay(id) {
    partyService
      .deleteParty(id)
      .then(() => {
        return partyService.getAllParties(); //then response to promise that accesses method to return all parties/render all data to the API
      })
      .then((parties) => this.display(parties));
  }

  static editParty(id) {
    partyService
      .getParty(id)
      .then(() => {
        return partyService.getAllParties(); //then response to promise that accesses method to return all parties/render all data to the API
      })
      .then((parties) => this.render(parties)); //then response to promise that returns the parties in this class and calls render method below
  }

  static addCharacter(id) {
    console.log(id);
    //static method to add a character to a party, uses id as parameter
    for (let party of this.parties) {
      //loops through parties
      if (party._id == id) {
        //condition to check if party IDs match
        party.characters.push(
          //if condition met then a new character is pushed into Party class array
          new Character(
            $(`#${party._id}-character-name`).val(),
            $(`#${party._id}-character-race`).val(),
            $(`#${party._id}-character-class`).val(),
            $(`#${party._id}-character-alignment`).val() //data for new character to include name value entered by user on input form
          )
        );
        partyService
          .updateParty(party) //calls static method from partieservice class to update party info for API
          .then(() => {
            return partyService.getAllParties(); //then response to promise that accesses method to return all parties/render all data to the API
          })
          .then((parties) => this.render(parties)); //then response to promise that returns the parties in this class and calls render method below
      }
    }
  }

  static deleteCharacter(partyId) {
    //static method to delete characters with parameters for party and character ID
    for (let party of this.parties) {
      //loops through party array
      if (party._id == partyId) {
        //condition for if IDs match
        for (let character of party.characters) {
          //if condition met, then it loops through the characters
          //condition for if character IDs match
          party.characters.splice(party.characters.indexOf(character), 1); //method to remove character from array using the index of the character in the loop and removing only 1
          partyService
            .updateParty(party) //calls static method to update party info in API
            .then(() => {
              return partyService.getAllParties(); //then method for promise to return getAllParties method
            })
            .then((parties) => this.render(parties));
        }
      }
    }
  }

  static deleteCharacterInDisplay(partyId) {
    //static method to delete characters with parameters for party and character ID
    for (let party of this.parties) {
      //loops through party array
      if (party._id == partyId) {
        //condition for if IDs match
        for (let character of party.characters) {
          //if condition met, then it loops through the characters
          //condition for if character IDs match
          party.characters.splice(party.characters.indexOf(character), 1); //method to remove character from array using the index of the character in the loop and removing only 1
          partyService
            .updateParty(party) //calls static method to update party info in API
            .then(() => {
              return partyService.getAllParties(); //then method for promise to return getAllParties method
            })
            .then((parties) => this.display(parties));
        }
      }
    }
  }

  static render(parties) {
    this.parties = parties;
    $("#app").empty(); //clears it before re-rendering
    for (let party of parties) {
      //for loop to re-render party data
      let characters = partyService.getPartyCharacters(party._id);
      //   console.log(`Characters ${party._id} :`, characters);

      // console.log("charCounter:", this.charCounter);

      console.log("Party:", party);
      //add a character array to the party
      party.characters = party.characters || []; //if party characters are undefined, then set them to an empty array
      //for loop to re-render partys data
      $("#app").prepend(
        //prepend adds new content to the top with html for all the parties below
        `<div id="${party._id}" class="card" style="margin-top: 10px;">
            <div class="card-header">
                <h2 style="display: flex;
                align-items: center;">${party.name}&nbsp;<button style="align-items: center; display: flex" class="btn btn-danger btn-sm" onclick="DOMManager.deleteParty('${party._id}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
              </svg>&nbsp;Delete Party </button></h2>
                
             </div>
             <div class="card-body">
                    <div class="row">
                        <div class="col-sm">
                        <form>
                        <a target="_blank" href="https://www.masterthedungeon.com/dnd-name-generator/" data-toggle="tooltip" title="Click for help finding a name">Enter Character Name:</a><input type="text" id="${party._id}-character-name" class="form-control" ><br>
                        <a target="_blank" href="https://www.dndbeyond.com/races" data-toggle="tooltip" title="Click to learn more about character races">Enter Character Race:</a><input type="text" id="${party._id}-character-race" class="form-control">
                        <br>
                        
                        <a target="_blank" href="https://www.dndbeyond.com/classes" data-toggle="tooltip" title="Click to learn more about character classes">Enter Character Class:</a><input type="text" id="${party._id}-character-class" class="form-control" ><br>
                        <a target="_blank" href="https://www.dndbeyond.com/sources/basic-rules/personality-and-background#Alignment" data-toggle="tooltip" title="Click to learn more about character alignments">Enter Character Alignment:</a><input type="text" id="${party._id}-character-alignment" class="form-control" >
             </form>
                      
                    <button style="margin-top:10px; align-items: center; display: flex" id="${party._id}-new-character" onclick="DOMManager.addCharacter('${party._id}')" class="btn btn-dark"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill-add" viewBox="0 0 16 16">
                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                    <path d="M2 13c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z"/>
                  </svg>&nbsp;Add Character </button>
             
        <br>`
      );
      for (let character of party.characters) {
        console.log("Character:", party._id);
        //for loop to run through characters in the current party in the loop
        $(`#${party._id}`) //grabs the party id
          .find(".card-body") //uses find to access class "card-body"
          .append(
            //attaches below html info at the end (the info of the characters with a delete button)
            `<p>
                <h5 style="display: flex;
                align-items: center;" id="name-${character._id}"><strong>Name: </strong> ${character.name}</h5>
                <span id="name-${character._id}"><strong>Race: </strong> ${character.race}</span>
                <span id="name-${character._id}"><strong>Class: </strong> ${character.dndClass}</span>
                <span id="name-${character._id}"><strong>Alignment: </strong> ${character.alignment}</span><br>
                <button class="btn btn-outline-danger" onclick="DOMManager.deleteCharacter('${party._id}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
              </svg></button>
                </div>
                </div>
                <div>
                </div> `
          );
      }
    }
  }

  static display(parties) {
    fetch("https://63b347155901da0ab37bb978.mockapi.io/api/dndpartymaker/party")
      .then((res) => res.json())
      .then((data) => {
        $("#app").empty();
        for (let party of data) {
          //for loop to re-render parties data
          let characters = partyService.getPartyCharacters(party._id);
          //   console.log(`Characters ${party._id} :`, characters);

          // console.log("charCounter:", this.charCounter);

          console.log("Party:", party.name);
          //add a character array to the party
          party.characters = party.characters || []; //if party characters are undefined, then set them to an empty array
          //for loop to re-render partys data
          $("#app").prepend(
            //prepend adds new content to the top with html for all the parties below
            `<div id="${party._id}" class="card" style="margin-top: 10px">
             <div class="card-body">
                    <div class="row">
                        <div class="col-sm">
                        <h2 display="flex" align-items="center"><img height="60px" src="images/—Pngtree—role playing game_8817282.png"><strong> ${party.name} </strong><img height="60px" src="images/—Pngtree—role playing game_8817282.png"></h2>`
          );
          for (let character of party.characters) {
            console.log("Character:", party._id);
            //for loop to run through characters in the current party in the loop
            $(`#${party._id}`) //grabs the party id
              .find(".card-body") //uses find to access class "card-body"
              .append(
                //attaches below html info at the end (the info of the characters with a delete button)
                `<div class="row">
                <div class="col-sm">
                <h4 id="name-${character._id}"><strong> ${character.name}</strong></h4>
                <h5 id="name-${character._id}"><strong>Race: </strong> ${character.race}</h5>
                <h5 id="name-${character._id}"><strong>Class: </strong> ${character.dndClass}</h5>
                <h5 id="name-${character._id}"><strong>Alignment: </strong> ${character.alignment}</h5>
                <button style="margin-bottom:10px" class="btn btn-outline-danger" onclick="DOMManager.deleteCharacterInDisplay('${party._id}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
              </svg></button>
                </div>
                </div>
                </div>`
              );
          }
          $(`#${party._id}`).find(".card-body")
            .append(`<div style="margin-top: 10px">
            <button class="btn btn-warning" onclick="DOMManager.editParty('${party._id}')">Edit Party</button>&nbsp;<button class="btn btn-danger" onclick="DOMManager.deletePartyInDisplay('${party._id}')">Delete Party</button>
            </div>`);
        }
      });
  }
}

$("#create-new-party").on("click", () => {
  //jquery method to access "create new party" button and tells what to do on click
  DOMManager.createParty($("#new-party-name").val()); //on click it access the createparty method in the DOMManager class and returns the value entered by user on input
  $("#new-party-name").val(""); //resets input form value to empty string
  DOMManager.getAllParties();
});

$("#edit-parties").on("click", () => {
  //jquery method to access "create new party" button and tells what to do on click
  DOMManager.getAllParties(); //on click it access the createparty method in the DOMManager class and returns the value entered by user on input
});

$("#display-party").on("click", () => {
  let div = document.getElementById(".card");
  DOMManager.displayParties();
  console.log("Running function 1");
});

$("#clear-page").on("click", () => {
  console.log("Running function 2");
  location.reload();
  {
    once: true;
  }
});

/*TODO 
-add tooltips that have hyperlink for information on races, class, etc.
-explore bootstrap fonts
*/
