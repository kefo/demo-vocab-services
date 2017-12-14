var config = require('./config');

var DidYouMean = require('./services/DidYouMean');
var YouMightAlsoLike = require('./services/YouMightAlsoLike');
var Suggestions = require('./services/Suggestions');

module.exports = function (app) {
    
    app.get("/didyoumean$", function(req, res) {
        
        console.log(req.query);
        var q = req.query.q;
        var by = req.query.by;
        var dy = req.query.dy;
        var minScore = req.query.minScore;
        var serialization = "json"

        if (minScore === undefined) {
            minScore = .625;
        }
        
        if (serialization === undefined || serialization !== "json") {
            serialization = "json";
        }
        
        DidYouMean.search(q, by, dy, minScore, function(err, response) {
            res.type('application/json');
            res.send(response);  
        });

    });
    
    app.get("/youmightalsolike", function(req, res) {
        
        console.log(req.query);
        var q = req.query.q;
        var serialization = "json"
        
        if (serialization === undefined || serialization !== "json") {
            serialization = "json";
        }
        
        YouMightAlsoLike.search(q, function(err, response) {
            res.type('application/json');
            res.send(response);  
        });

    });
    
    app.get("/suggestions", function(req, res) {
        
        console.log(req.query);
        var q = req.query.q;
        var by = req.query.by;
        var dy = req.query.dy;
        var minScore = req.query.minScore;
        var serialization = "json"

        if (minScore === undefined) {
            minScore = .625;
        }
        
        if (serialization === undefined || serialization !== "json") {
            serialization = "json";
        }
        
        Suggestions.search(q, by, dy, minScore, function(err, response) {
            res.type('application/json');
            res.send(response);  
        });

    });
    
    app.get("/", function(req, res) {
        
        console.log(req.query);
        var q = req.query.q;
        var qlabelselected = req.query.qlabelselected;

        var showResults = false;
        if (q !== undefined) {
            showResults = true;
        }
        if (qlabelselected === undefined) {
            qlabelselected = false;
        }
        
        var relateds = [];
        var pageData = {
            "showResults": showResults,
            "qlabelselected": qlabelselected,
            "relateds": relateds
        }
        if (q !== undefined && qlabelselected == "true") {
            // related?
            console.log("Checking for you might also likes...");
            YouMightAlsoLike.search(q, function(err, response) {
                console.log(response)
                pageData.relateds = response.results;
                res.render('index', pageData);
            });
        } else if (q !== undefined) {
            DidYouMean.search(q, .625, function(err, response) {
                pageData.relateds = response.results;
                res.render('index', pageData);
            });
        } else {
            res.render('index', pageData);
        }

    });

    /*
    app.get("/about.html", function(req, res) {
        res.render('about');
    });
    app.get("/gettingstarted.html", function(req, res) {
        res.render('gettingstarted');
    });
    */
};
