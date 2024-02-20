// This file is run by the browser each time your view template is loaded

/**
 * Define variables that reference elements included in /views/index.html:
 */

const factionPieEl = document.getElementById('factionPie');
const playerPieEl = document.getElementById('playerPie');
const combinedRadarEl = document.getElementById('combinedRadar');
const gamesTableEl = document.getElementById('gamesTable');

Chart.register(ChartDataLabels);
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
const players = ['Caleb','Eli','Eddie','Rubin']


// Appends the blocks API response to the UI
const updateChart = function (apiResponse) {
  const factionWins = labels.reduce((full,current)=>(full[current]=0,full),{})
  const playerWins = players.reduce((full,current)=>(full[current]=0,full),{})
  const playerFactionWins = players.reduce((full,current)=>(full[current]=labels.reduce((full,current)=>(full[current]=0,full),{}),full),{})
  console.log(playerFactionWins);
  apiResponse['data']['results'].map( async (row,index)=>{
    const faction = row.properties['Winning Faction'].formula.string;
    const player = row.properties['Winning Player'].formula.string;
    factionWins[faction]++ 
    playerWins[player]++ 
    playerFactionWins[player][faction]++ 
  });
  console.log(playerFactionWins);
  const data = {
    labels: labels,
      datasets: [{ 
        data: labels.map((key) => factionWins[key]),
        backgroundColor: labels.map((key)=> factionColors[key]),
        hoverOffset: 4,
        datalabels: {
          labels: {
            name: {
              align: 'top',
              font: {size: '14rem', weight: 'bold'},
              color: 'white',
              formatter: function(value, ctx) {
                return ctx.active
                  ? 'name'
                  : ctx.chart.data.labels[ctx.dataIndex];
              }
            },
            value: {
              align: 'bottom',
              backgroundColor: 'white',
              borderColor: 'white',
              borderWidth: 2,
              borderRadius: 4,
              padding: 4
            }
          }
        }

      }]
    };
  new Chart(factionPieEl, {
      type: 'pie',
      options: {
        plugins: {
            legend: {
                display: false
            }
        }
      },
      data: data
    });
  const data2 = {
      labels: players,
        datasets: [{
          data: players.map((key) => playerWins[key]),
          hoverOffset: 4,
          datalabels: {
            labels: {
              name: {
                align: 'top',
                font: {size: '14em', weight: 'bold'},
                color: 'white',
                formatter: function(value, ctx) {
                  return ctx.active
                    ? 'name'
                    : ctx.chart.data.labels[ctx.dataIndex];
                }
              },
              value: {
                align: 'bottom',
                backgroundColor: 'white',
                borderColor: 'white',
                borderWidth: 2,
                borderRadius: 4,
                padding: 4
              }
            }
          }
        }]
      };
  new Chart(playerPieEl, {
      type: 'pie',
      data:  data2,
      options: {
        plugins: {
            legend: {
                display: false
            }
        }
      },
    });

  const data3 = {
    labels: labels,
      datasets: 
        players.map((player)=>{
          return new Object({
            label: player,
            data:  labels.map((key) => playerFactionWins[player][key]),
          })
        })       
    };

  new Chart( combinedRadarEl, {
    type: 'radar',
    data:  data3,
    options: {
      plugins: {
          legend: {
              display: false
          }
      },scales: {
        r: {
            min: -.5,
            max: 2,
            ticks: {
              stepSize: 1
            }
        }
      }
    }

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
        const fieldEl = gameRow.insertCell()
        fieldEl.appendChild(document.createTextNode(value))
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




