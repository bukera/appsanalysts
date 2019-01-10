var store = require('app-store-scraper');
const sqlite3 = require('sqlite3').verbose();
let db;

alpha = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','y','z']


// store.search({
		// term: 'a',
		// num: 200,
		// page: 1,
		// country : 'us',
		// lang: 'en-us'
	// }).then(function(arr){console.log(arr.length)})
		
openDB();

function openDB(){
	db = new sqlite3.Database('./db/appstore.db', (err) => {
		if (err) {
			return console.error(err.message);
	}
		console.log('Connected to the in-memory SQlite database.');
		
		fetchApps();
	});
}

function endSession(){
	closeDB();
}

		
function closeDB(){
	db.close((err) => {
		if (err) {
			return console.error(err.message);
		}
		console.log('Close the database connection.');
	});
}

function fetchApps(){
	(function myLoop (i) {          
		setTimeout(function () {   
			for (j=1; j<=10; j++){
				fetchData(alpha[i]+alpha[4],j) 
			}				
			if (i--) 
				myLoop(i)
			else
				setTimeout(endSession, 72000)
		}, 6000)
	})(alpha.length-1); 
}

// function fetchApps(){
	// for (i=s; i<alpha.length; i++){
		// for (j=1; j<=2; j++){
			// fetchData(alpha[i],j);
		// }	
		// if(i%10 == 0)
			// setTimeout(fetchApps(i), 6000)
	// }	
// }                    

function fetchData(l,p){
	store.search({
		term: l,
		num: 200,
		page: p,
		country : 'us',
		lang: 'en-us'
	}).then(function(arr){
		console.log(l,p)
		arr.forEach(function(result){
			db.run(`INSERT INTO apps(id, appId, url, title, description, icon, genres, genreIds, primaryGenre, primaryGenreId, contentRating, languages, size, requiredOsVersion, released, updated, releaseNotes, version, price, currency, free, developerId, developer, developerUrl, developerWebsite, score, reviews, currentVersionScore, currentVersionReviews, screenshots, ipadScreenshots, appletvScreenshots, supportedDevices) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, result['id'], result['appId'], result['url'], result['title'], result['description'], result['icon'], JSON.stringify(result['genres']), JSON.stringify(result['genreIds']), result['primaryGenre'], result['primaryGenreId'], result['contentRating'], JSON.stringify(result['languages']), result['size'], result['requiredOsVersion'], result['released'], result['updated'], result['releaseNotes'], result['version'], result['price'], result['currency'], result['free'], result['developerId'], result['developer'], result['developerUrl'], result['developerWebsite'], result['score'], result['reviews'], result['currentVersionScore'], result['currentVersionReviews'],JSON.stringify(result['screenshots']), JSON.stringify(result['ipadScreenshots']), JSON.stringify(result['appletvScreenshots']), JSON.stringify(result['supportedDevices'])
			,function(error) {
				if (error) 
					console.log(error)
			});	
		})	
	}
	).catch(console.log);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
