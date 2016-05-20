// dependencies
var config = require('./config');

var express = require('express');

// main config
var app = express();
app.set('port', process.env.PORT || config.app.port || 7000);

app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', './views')

// routes
require('./routes')(app);

app.listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')))
});
