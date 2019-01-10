
const ObjectsToCsv = require('objects-to-csv');
var memoizedCustom = require('google-play-scraper').memoized({ maxAge: 1000 * 600 });

alpha = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','y','z']

t=1000;
t2=1000;

for(j in alpha) {
  setTimeout(fetchApps, t,j);
  t=t+1000;
}

function fetchApps(i){
  for(j in alpha) {
    setTimeout(fetchApp, t2,i,j);
    t2=t2+1000;
  }
  }

function fetchApp(i1,i2){
  var initializePromise = memoizedCustom.search({
    term: i1+i2,
    num: 40,
    country : 'us',
    lang: 'en',
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
  await csv.toDisk('./IDList.csv',{append: true});
}
