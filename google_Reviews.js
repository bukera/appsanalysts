var gplay = require('google-play-scraper');
const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');
// This code to download the reviews usning the ids collected before
var IDList = fs.readFileSync('ids.csv').toString().split("\n");

t=1000;
for(i=1;i<100;i++) { //each time I run the code I change loop from 1 to 100 then 100 to 200 ...
  setTimeout(fetchApps, t,i);
  t=t+60000
}

function fetchApps(i){

  var lines=IDList[i];
  var fields = lines.split(',');
  var appId=fields[0];
  var appScore=fields[1];
  var gener=fields[2];
  var subgener=fields[3];
  var rev=fields[4];
  var num =Math.ceil(parseInt(rev)/40);
  if (parseInt(rev)<=40)
  {
    num=0;
  }
  if (num>10)
  {
    num=10;
  }
  
  for(j=0;j<=num;j++)
  {
    setTimeout(fetchData, 60000,appId,j,appScore,gener,subgener);
  }

}

function fetchData(appId,p,appScore,gener,subgener){
var initializePromise = gplay.reviews({
  appId: appId,
  page: p,
  lang: 'en',
  country: 'us',
  throttle:1,
  sort: gplay.sort.HELPFULNESS
});

initializePromise.then(function(result) {
  //console.log(result);
  writeToCSV(result,appId,appScore,gener,subgener);
}, function(err) {
  console.log(err);
});
}

async function writeToCSV(objData,appId,appScore,gener,subgener) {
  
  objData.forEach(function(item){
    item.appId=appId;
    item.appScore=appScore;
    item.appGener=gener;
    item.appSubGener=subgener;
  });

  let csv = new ObjectsToCsv(objData);
  // Save to file:
  await csv.toDisk('./Review.csv',{append: true});
}