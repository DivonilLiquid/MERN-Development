const fs = require('fs');
const server = require('http').createServer();

server.on('request',(req,res) => {
    //1. Normal solution
    // fs.readFile('./test-file.txt',(err, data) => {
    //     if(err) console.log(err);
    //     else res.end(data);
    // })
    
    //2. Using streams
    // const readable = fs.createReadStream('./test-file.txt');
    // readable.on('data',(chunk) => {
    //     res.write(chunk);//have sent all data from here
    // })
    // readable.on('end',() => {
    //     res.end();//sending nothing from here, but it's important
    // })
    // readable.on('error',(error) => {
    //     console.log(error)
    //     res.statusCode =404;
    //     res.end('File not found');//sending nothing from here, but it's important
    // })

    //3.pipe operator(best- avoids backpressure)
    const readable = fs.createReadStream('./test-file.txt');
    readable.pipe(res);
    //readablesource.pipe(destination)

})
server.listen(8000,'127.0.0.1',()=>{
    console.log('listening on......');
})