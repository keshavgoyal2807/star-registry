function validate_request(address){
    const timeWindow = 5*60*1000;
    // if(mem.indexOf[address] === undefined)
    // {
    //     mem.mempool.push(address);
    //     const length = mem.mempool.length;
    //     mem.indexOf[address] = length-1;
    //     mem.timeOutRequest[address] = setTimeout(function(address){
    //         clearTimeout(timeOutRequest[address]);

    //     },timeWindow)
    // }
    // else
    // {
    //     const index = mem.indexOf[address];

    // }
    if(mem.mempool[address] === 0 || mem.mempool[address] === undefined){
        let Time = (new Date().getTime().toString().slice(0,-3))
        const message = `${address}:${Time}:starRegistry`
        mem.mempool[address] ={
            walletAddress:address,
            timeStamp: Time,
            message:message,
            timeWindow: 300
        };
        mem.timeOutRequest[address] = (function(address){
            const c_address = address;
            setTimeout(function(k){
                // clearTimeout(mem.timeOutRequest[k]);
                mem.mempool[address] = 0;
                console.log(mem.mempool[address]+'completed');
            },timeWindow);
        })(address)
    }
    else
    {
        var obj = mem.mempool[address];
        const timeElapse = (new Date().getTime().toString().slice(0,-3)) - obj.timeStamp;
        console.log(timeElapse);
        const timeLeft = (timeWindow/1000) - timeElapse;
        obj.timeWindow = timeLeft;
        mem.mempool[address] = obj;
    }
    return mem.mempool[address];
}

class mempool{
    constructor(){
        this.mempool=[],
        this.timeOutRequest=[],
        this.mempoolValid=[]
    }
}

const mem = new mempool();

module.exports = {
    mem,
    validate_request
}