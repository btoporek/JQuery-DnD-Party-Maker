// ALTERNATE JS FILE WITH CODE NOT CURRENTLY IN USE IN MAIN JS FILE - SAVED FOR FUTURE PROJECTS

/*Character Class
-variables for name, race, class, alignment (reference DnD APIs here?)
*/
class Character {
  static raceNames = [];
  static dndClassNames = [];
  static alignmentNames = [];

  static getRaces() {
    fetch("https://www.dnd5eapi.co/api/races")
      .then((res) => res.json())
      .then((data) => {
        for (let i = 0; i < data.results.length; i++) {
          Character.raceNames.push(data.results[i].name);
        }
        //CODE THAT CREATES DROP DOWN FOR RACES; CAN ONLY WORK WITHIN FETCH CALL
        for (let i = 0; i < Character.raceNames.length; i++) {
          let option = document.createElement("OPTION");
          let txt = document.createTextNode(Character.raceNames[i]);
          option.appendChild(txt);
          option.setAttribute("value", Character.raceNames[i]);
          select.insertBefore(option, select.lastChild);
        }
      });
  }

  static getDndClasses() {
    fetch("https://www.dnd5eapi.co/api/classes")
      .then((res) => res.json())
      .then((data) => {
        for (let i = 0; i < data.results.length; i++) {
          Character.dndClassNames.push(data.results[i].name);
        }
      });
    console.log(Character.dndClassNames);
  }

  static getAlignments() {
    fetch("https://www.dnd5eapi.co/api/alignments")
      .then((res) => res.json())
      .then((data) => {
        for (let i = 0; i < data.results.length; i++) {
          Character.alignmentNames.push(data.results[i].name);
        }
      });
    console.log(Character.alignmentNames);
  }
}

//async await function
/*
async function doStuff(args) {
    const response = await $.ajax({
        url: ajaxurl,
        type: 'POST',
        data: args
    });
    return response;
}
*/
