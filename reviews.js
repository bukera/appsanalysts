var store = require('app-store-scraper');
const sqlite3 = require('sqlite3').verbose();
var csv = require('fast-csv');
let db;

let fromPath = './data/apple-games-dist.csv'
let toPath = "done-games.csv"

apps = []
done_ids = []
		
readData();

function readData(){
	csv.fromPath(fromPath)
		.on('data', function(data) {
			apps.push([data[0],data[6],data[7],data[8],data[9]]);
		})
		.on('end', function() {
			apps.shift()
			console.log(apps.length + ' ids');
			openDB();
	});
}	

function openDB(){
	db = new sqlite3.Database('./db/appstore.db', (err) => {
		if (err) {
			return console.error(err.message);
	}
		console.log('Connected to the in-memory SQlite database.');
		
		fetchReviews();
	});
}

function endSession(){
	writeDone();
	closeDB();
}

function writeDone(){
	csv.writeToPath(toPath, [
		done_ids])
		.on("finish", function(){
			console.log("done!");
	});
}

function closeDB(){
	db.close((err) => {
		if (err) {
			return console.error(err.message);
		}
		console.log('Close the database connection.');
	});
}

function fetchReviews(){
	(function myLoop (i) {  
		console.log(i)
		setTimeout(function () {   
			for (j=1; j<=10; j++){
				fetchData(apps[i],j) 
			}				
			if (i--) 
				myLoop(i)
			else
				setTimeout(endSession, 12000)
		}, 6000)
	})(apps.length-1);
}
         
function fetchData(app,p){
	store.reviews({
		id: app[0],
		country: 'us',
		sort: store.sort.HELPFUL ,
		page: p
	}).then(function(arr){
		arr.forEach(function(result){
			db.run(`INSERT INTO reviews_games(app, genres, genreIds, primaryGenre, primaryGenreId, id, version, score, title, text)  VALUES(?,?,?,?,?,?,?,?,?,?)`, app[0], JSON.stringify(app[1]), JSON.stringify(app[2]), app[3], app[4], result['id']
			,result['version'], result['score'], result['title'], result['text'] ,function(error) {
				if (error) 
					console.log(error)
			});	
		})	
	}
	).catch(function(error){
		done_ids.push(app[0]+'page '+p+'\n')
		console.log(app[0]+' '+p)
		console.log(error)
	});
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}