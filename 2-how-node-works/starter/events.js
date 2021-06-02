const eventEmitter = require('events');
const http = require('http');
//Extending eventEmitter class
class sales extends eventEmitter{
    constructor(){
        super();//used to inherit all the properties of eventEmitter
    }
}
const myEmitter = new sales();

myEmitter.on('newSale',()=>{
    console.log("New sale is available");
})
myEmitter.on('newSale',()=>{
    console.log("Customer name: Divonil");
})
myEmitter.on('newSale',(stock)=>{
    console.log(`Now left ${stock}`);
})
myEmitter.emit('newSale',9);


////////////////////////////////

const server = http.createServer();

server.on("request",(req,res)=>{
    console.log("request recieved");
    console.log(req.url);
    res.end("request recieved");
});
server.on("request",(req,res)=>{
    console.log("Another request😄");
});
server.on("close",()=>{
    console.log("Server closed");
    
});

server.listen(8000,'127.0.0.1',()=>{
    console.log("waiting for request");
})
