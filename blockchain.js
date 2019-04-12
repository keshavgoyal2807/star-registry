const level = require('level');
const DB = './DB';
const db = level(DB);
const sha256 = require('crypto-js/sha256');
const mem = require('./validation_request.js').mem;

//ADDDATA
function addData(key,value){
   return new Promise(function(resolve,reject){
    db.put(key,value,function(err){
        if(err)
        {
            console.log(err);
        }
        else
        {
            resolve(value);
        }
    })
   }) 
}

//GETBLOCK
function getBlock(height){
    return new Promise(function(resolve,reject){
        db.get(height,function(err,data)
        {
            if(data)
            {
                resolve(JSON.parse(data));
            }
            else
            {
                console.log(err);
            }
        })
    })
}

// GETBLOCKHEIGHT
function getBlockHeight(){
    return new Promise(function(resolve,reject)
    {
        let newHeight = -1;
        db.createReadStream().on('data',function(data){
            newHeight++;
        }).on('error',function(error){
            console.log(error);
        }).on('end',function(){
            resolve(newHeight);
        })
    })
}

//GETBLOCKHASH
function getBlockHash(height){
    return new Promise(function(resolve,reject){
        db.get(height,function(err,data){
            if(data)
            {
                data1 = JSON.parse(data);
                resolve(data1.hash);
            }
        });
    })
}

class block{
    constructor(data){
        this.timeStamp=0,
        this.height=0,
        this.hash="",
        this.body=data,
        this.previousBlockHash=""
    }
}

class chain{
    constructor(){
    }
    addBlock(block){
        getBlockHeight().then((height) =>{
            block.height  = height+1;
            block.timeStamp = new Date().getTime().toString();
            if(height>0)
            {
                getBlockHash(height).then((hash) =>{
                    block.previousBlockHash = hash;
                    block.hash = sha256(JSON.stringify(block)).toString();
                    addData(block.height,JSON.stringify(block)).then((block)=>{
                        return(block);
                    });
                });
            }
            else
            {
                block.hash = sha256(JSON.stringify(block)).toString();
                addData(block.height,JSON.stringify(block)).then((block)=>{
                    return(block);
                });
            }
        }).catch((e) =>{
            console.log(e);
        });
    }
    createBlock(data){
        let add  = data.address;
        if(mem.mempoolValid[add]!==undefined)
        {
           return(this.addBlock(new block(data))) ;
        }
        else
        {
            return('validate address');
        }
    }
}

const blockchain = new chain();


module.exports={
    blockchain,
    getBlockHash,
    getBlock,
    getBlockHeight
}

db.createReadStream()
    .on('data',function(data){
        console.log(data);
    })
    .on('error',function(error){
        console.log(error);
    })
    .on('end',function(){

    });