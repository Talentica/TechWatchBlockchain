var express = require('express');
var app = express();

var bitcoin = require('bitcoin-promise')


var client = new bitcoin.Client({
  host: '127.0.0.1',
  port: 18332,
  user:'hemant',
  pass :'hemant',
  timeout: 300000
});




app.use(express.static('public'));

app.set('view engine', 'pug')


app.get('/', function (req, res) {
  res.render('index', { node_name: process.env.NAME })
})

app.get('/balance', function (req, res) {
    client.getBalance().then(function(balance){
        res.setHeader('Content-Type', 'application/json');
        res.send('{"balance" : ' + balance + '}');
    })
})


app.get('/transfer', function (req, res) {
    
   client.sendToAddress(req.query.toAddress, req.query.quantity).then(function(transaction){
       console.log('sending transaction id ' + transaction)
       res.setHeader('Content-Type', 'application/json');
       res.send('{"txid" : "' + transaction + '"}');
       
       client.generate(1).then(function(block){
           console.log("new block generated " + block)
       })
       
    })
})

var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})