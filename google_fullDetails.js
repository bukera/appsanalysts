var gplay = require('google-play-scraper');
const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');
var memoizedCustom = require('google-play-scraper').memoized({ maxAge: 1000 * 600 });

// This code to download the full details of the application using the ids collected before
var IDList = fs.readFileSync('ids/IDList.csv').toString().split("\n");

t=1000;
for(j=1; j<100 ; j++) { //each time I run the code I change loop from 1 to 100 then 100 to 200 ...
  setTimeout(fetchApps, t,j);
  t=t+1000;
}

function fetchApps(i){
  var initializePromise = memoizedCustom.search({
    term: IDList[i],
    num: 1,
    country : 'us',
    lang: 'en',
    fullDetail: true,
    throttle: 1
    });
  initializePromise.then(function(result) {
    writeToCSV(result);
  }, 
  function(err) {
  console.log(err);
  });
 
  }

async function writeToCSV(objData) {
  let csv = new ObjectsToCsv(objData);
  await csv.toDisk('./AppList.csv',{append: true});
}
