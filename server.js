const express = require('express');
const app = express();

app.use(express.static('build'));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

// listen for requests :)
process.env.PORT = 8080;
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});