const express = require('express');
const bodyParser = require('body-parser');
const blockchain = require('./blockchain.js').blockchain;
const validation_request = require('./validation_request.js').validate_request;
const verify_message = require('./verify_message.js').verify_message;

const app = express();
app.use(bodyParser.json());

app.post('/block',function(req,res){
    const body = req.body;
    if(body==="" || body === 'undefined')
    {
        res.send('body is empty');
    }
    else
    {
        res.send(blockchain.createBlock(body));
    }
})

app.post('/requestValidation',function(req,res){
    const address = req.body.address;
    if(address === "" || address === 'undefined')
    {
        res.send('body is empty');
    }
    else
    {
        res.send(validation_request(address));
    }
})

app.post('/message-signature/validate',function(req,res){
    const address = req.body.address;
    const signature  = req.body.signature;
    if(address === "" || address === 'undefined'||signature === "" || signature === 'undefined')
    {
        res.send('address or signature is empty');
    }
    else
    {
        res.send(verify_message(address,signature));
    }
})
app.listen(8000,(err,res)=>{
    if(err)
    {
        console.log('unable to connect');
    }
    else{
        console.log('connected to port 8000');
    }
})