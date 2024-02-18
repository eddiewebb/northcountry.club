// This file is run by the browser each time your view template is loaded

/**
 * Define variables that reference elements included in /views/index.html:
 */

// Forms
// Table cells where API responses will be appended
const dbResponseEl = document.getElementById("dbResponse")
const pageResponseEl = document.getElementById("pageResponse")
const blocksResponseEl = document.getElementById("blocksResponse")
const commentResponseEl = document.getElementById("commentResponse")

const factionPieEl = document.getElementById('factionPie');
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



// Appends the blocks API response to the UI
const updateChart = function (apiResponse, el) {
  console.log(apiResponse)
  const factionWins = {  };
  apiResponse['data']['results'].map( async (row,index)=>{
    const faction = row.properties['Winning Faction'].formula.string;
    if( faction in factionWins ){
      factionWins[faction] += 1;
    }else{
      factionWins[faction] = 1
    }
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

    new Chart(el, {
    type: 'pie',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
    });
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
  updateChart(newDBData, factionPieEl)
});


