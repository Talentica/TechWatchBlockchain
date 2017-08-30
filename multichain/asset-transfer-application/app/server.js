var express = require('express');
var app = express();


var client = require("multichain-node")({
    port: 4359,
    host: '127.0.0.1',
    user: "hemant",
    pass: "hemant"
});



app.use(express.static('public'));

app.set('view engine', 'pug')


app.get('/', function (req, res) {
  res.render('index', { node_name: process.env.NAME })
})

app.get('/balance', function (req, res) {
    client.getTotalBalances( function(err, balance)  {
        console.log(err)
        res.setHeader('Content-Type', 'application/json');
        res.send(balance );
        
    })
})


app.get('/transfer', function (req, res) {
    
       res.setHeader('Content-Type', 'application/json');
       res.send('{"status" : "Pending"}');

})

var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})