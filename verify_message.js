const mem = require('./validation_request.js').mem;
const bitcoinjs_lib = require('bitcoinjs-lib');
const bitcoinjs_message = require('bitcoinjs-message');

//verify
function verify_message(address,signature){
    let obj =mem.mempool[address];
    if(obj!=0)
    {
        // console.log('123');
        let message = obj.message.toString();
        console.log(message);
        let verify = bitcoinjs_message.verify(message,address,signature);
        if(verify)
        {
            let obj =mem.mempool[address];
            if(obj!=0)
            {
                mem.mempoolValid[address]={registerStar:true,
                                            status:{
                                                address:address,
                                                timeStamp:obj.timeStamp,
                                                message:obj.message,
                                                messageSignature:true
                                            }};
                return(mem.mempoolValid[address]);
            }
            else
            {
                return('time window expired please try again');
            }
        }
        else
        {
            return('signature not valid');
        }
    }
    else
    {
        return('time window expired please try again');
    }
}

module.exports={
    verify_message
}