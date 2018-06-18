var express = require('express');
var bodyparser = require('body-parser');
var session = require('express-session');
var app = express();
var port = 3000;
var path = require("path");
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var publicPath = path.resolve(__dirname, "public");
var sessionOptions = {
	secret: 'secret cookie thang',
	resave: true,
	saveUninitialized: true
};

app.use(session(sessionOptions));
app.use(express.static(publicPath));
app.use(bodyparser.urlencoded({extended: false}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

var birdsArray = new Array ( {"number": '3', "name":"Bald Eagle"},
		{"number": '7', "name":"Yellow Billed Duck"},
		{"number": '4', "name":"Great Cormorant"}
);

//search to see if the bird is already in the sighting
//otherwise add a new bird with count of 1
function searchForBird(name) {
	var found = false;
	for (var i = 0; i < birdsArray.length; i++) {
		console.log(birdsArray[i].name.ignoreCase);
		if (birdsArray[i].name.ignoreCase === name.ignoreCase ) {
			birdsArray[i].number++;
			found= true;
		}
	}

	 if (found=== false){
			birdsArray.push({"number": '1', "name":name});
		}
}

function birds(num){
		var temp = new Array;
		for (var k = 0; k< birdsArray.length; k++) {
			if(birdsArray[k].number >= num){
				temp.push(birdsArray[k]);
			}
		}
		return temp;
}

app.get('/', function(req, res){
	console.log("Getting home");
	res.render('index',{
		url1: '/birds',
		url2: '/settings'
	});

});

app.get('/birds', function(req, res) {
		console.log("Getting Birds");
		req.session.birdsArray = birds(req.session.minNumber);

		var output;

		//if we did requre a min number to be shown go to session
		if (req.session.birdsArray.length !=0 ){
			output=req.session.birdsArray;
		}
		//if we didnt require a minimum display normal output
		else{
			output=birdsArray;
		}
	console.log(req.session.birdsA);
	res.render('birds', {
		'birds':output,
		 url1: '/settings', url2: '/'});
});

//get the settings page
app.get('/settings', function(req, res) {
	res.render('settings', {
		'minNumber':req.session.minNumber,
		url1: '/birds', url2: '/','value':req.session.minNumber});

});

app.post('/birds', function(req, res) {

		searchForBird(req.body.birds);
		res.redirect('/birds');
});

app.post('/settings', function(req, res) {
	req.session.minNumber = req.body.minNumber;
	res.redirect('/birds');
});

app.listen(port);
console.log('started server on port: ', port);
