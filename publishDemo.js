var ghpages = require('gh-pages');
var path = require('path');

ghpages.publish(path.join(__dirname, 'demo'), function(err) { console.log(path.join(__dirname, 'demo')); });