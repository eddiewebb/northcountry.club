// This file is run by the browser each time your view template is loaded

/**
 * Define variables that reference elements included in /views/index.html:
 */

const factionPieEl = document.getElementById('factionPie');
const playerPieEl = document.getElementById('playerPie');
const gamesTableEl = document.getElementById('gamesTable');
/**
 * Functions to handle appending new content to /views/index.html
 */
const factionColors = {
  "Marquise":"orange",
  "Eyrie":"blue",
  "Vagabond":"gray",
  "Woodland Alliance":"green",
} 
const labels =  [
  'Eyrie',
  'Vagabond',
  'Woodland Alliance',
  'Marquise'
];
const tableColumns = [
  'Date',
  'Winning Faction',
  'Winning Player',
  'Low Score'
]



// Appends the blocks API response to the UI
const updateChart = function (apiResponse) {
  console.log(apiResponse)
  const factionWins = {  };
  const playerWins = {  };
  apiResponse['data']['results'].map( async (row,index)=>{
    const faction = row.properties['Winning Faction'].formula.string;
    const player = row.properties['Winning Player'].formula.string;
    factionWins[faction] ? factionWins[faction]++ : factionWins[faction] = 1
    playerWins[player] ? playerWins[player]++ : playerWins[player] = 1
  });
  console.log(factionWins);
  const data = {
    labels: labels,
      datasets: [{        
        label: 'My First Dataset',
        data: labels.map((key) => factionWins[key]),
        backgroundColor: labels.map((key)=> factionColors[key]),
        hoverOffset: 4
      }]
    };
  new Chart(factionPieEl, {
      type: 'pie',
      data: data
    });
  const data2 = {
      labels: ['Caleb','Eli','Eddie','Rubin'],
        datasets: [{        
          label: 'My First Dataset',
          data:  ['Caleb','Eli','Eddie','Rubin'].map((key) => playerWins[key]),
          hoverOffset: 4
        }]
      };
  new Chart(playerPieEl, {
      type: 'pie',
      data: data2
    });
}

const updateTable = function (apiResponse) {
  console.log(apiResponse)
  //headers
  gamesTableEl.setAttribute('class','table-striped table table-sm')

  const tHead = gamesTableEl.createTHead()
  const trRow = tHead.insertRow()
  tableColumns.forEach((value, index)=>{
      const field = trRow.insertCell()
      field.setAttribute('scope','col')
      field.appendChild(document.createTextNode(value))
  });

  const tBody = gamesTableEl.createTBody()
  apiResponse.data.results.forEach( (game, index) => {
    const gameRow = tBody.insertRow()
    tableColumns.forEach((column, index)=>{
        const value = getStringOf(game.properties[column])
        console.log(value)
        const fieldEl = gameRow.insertCell()
        fieldEl.appendChild(document.createTextNode(value))
        console.log()
    });
  })
}

const getStringOf = function (notionProperty) {
  if (notionProperty.type == 'string'){
    return notionProperty.string
  }else if(notionProperty.type == 'date'){
    return notionProperty.date.start
  }else{
    return getStringOf(notionProperty[notionProperty.type])
  }

}

/**
 * Attach submit event handlers to each form included in /views/index.html
 */
 document.addEventListener("DOMContentLoaded", async function(event) {
  const newDBResponse = await fetch("/stats", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const newDBData = await newDBResponse.json()
  updateChart(newDBData)
  updateTable(newDBData)
});


