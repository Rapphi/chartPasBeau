

window.onload = (event) => {
    
console.log('page is fully loaded');


  
  //test de création d'un chart par chart.js
  /*var myChart = document.getElementById("myChart").getContext("2d");  
  var catPedigreeChart = new Chart(myChart, {
    type:"bar",
    data:{
      labels:["gouttière", "siamois", "burman", "chartreux", "slovenian"],
      datasets:[{
        label:"% du total de chats",
        data:[55, 6, 3, 8, 2]
      }]
    }
  })}*/
  //test d'import d'un fichier Json et affichage d'une clé et d'une valeur de celui-ci
  /*$(document).ready(function(){
    $.getJSON("/assets/data.json", function(dataExt) {
      console.log(dataExt);
    });

  }
);
*/

var values = [];
var axeDesx = [];
var i = 0;
//intégration d'un chart sous h1 via le DOM

var canvasTroisieme = document.createElement("canvas");
canvasTroisieme.setAttribute("id", "remoteDataChart");
canvasTroisieme.setAttribute("width", "auto");
canvasTroisieme.setAttribute("height", "200");
var nodeRef = document.getElementById("firstHeading");
nodeRef.after(canvasTroisieme);

//création du troisième chart via chart.js

const contexte3 = document.getElementById("remoteDataChart");
const myChart3 = new Chart(contexte3, {
  type: "line",
  data: {
    labels: axeDesx,
    datasets: [
      {
        label: "chiffres rafraîchis chaque sec.",
        data: values,
      },
      

    ]
  }
})
//import des données externes de manière asynchrone

function test() {
  var importExt = new XMLHttpRequest();
  importExt.open("POST", "https://canvasjs.com/services/data/datapoints.php", true);
  importExt.responseType = "json";
  importExt.send();

  var datarecup = [];
  var datarecup2 = [];
  importExt.onload = function () {
    if (importExt.status != 200) {
      console.log(`err ${importExt.status} : ${importExt.statusText}`);
    } else {
      // console.log(JSON.stringify(importExt.response));
      i++;
      // récupère la "value" du tableau
      datarecup = importExt.response.map((elem) => {
        return elem[1];
      });
      //console.log(datarecup);

      // récupère la "key" du tableau
      datarecup2 = importExt.response.map((elem) => {
        return elem[0];
      });
      //console.log(datarecup2);

      // pour éviter que l'axe des x ne s'écrase avec l'accumulation des données
      axeDesx.push(datarecup2);
      if (i > 10) {
        myChart3.data.labels.shift();
        myChart3.update();
      }

      values.push(datarecup);
      myChart3.update();

      // pour éviter que l'axe des y ne s'écrase avec l'accumulation des données
      if (i > 10) {
        myChart3.data.datasets[0].data.shift();
      }
      myChart3.update();
      
    }
  };

  importExt.onerror = function () {
    console.log("requ à échoué");
  };

  importExt.onprogress = function (event) {
    lengthComputable = Boolean;
    if (event.lengthComputable) {
      console.log(`${event.loaded} octets reçu /${event.total}`);
    }
  };
}
setInterval(test, 1000);



}
