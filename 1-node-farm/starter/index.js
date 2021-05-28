const fs = require('fs');
const http = require('http');
/*          Files                */
/*Blocking,synchronous ways  */
/*File system module - fs */
// const textIn = fs.readFileSync('./txt/input.txt','utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avacoda: ${textIn}. \nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',textOut);
// const written = fs.readFileSync('./txt/output.txt','utf-8');
// console.log(written);
/*non-Blocking,asynchronous way*/
// fs.readFile('./txt/startttt.txt','utf-8' ,(err,data1)=>{
//     if(err) return console.log("eRrrrr💣");
//     fs.readFile(`./txt/${data1}.txt`,'utf-8' ,(err,data2)=>{
//         console.log(data2);
//         fs.readFile(`./txt/append.txt`,'utf-8' ,(err,data3)=>{
//             console.log(data3);
//             fs.writeFile('.txt/final.txt',`${data2} \n${data3}`,'utf-8', err => {
//                 console.log('Your file has been written');
//             })
//         })
//     })
// })
// console.log("Still reading data....");



/*          Server           */
const server = http.createServer((req,res)=>{
    console.log(req);
    res.end('Hello from the server');
});
server.listen(8000,'127.0.0.1',()=>{
    console.log("Listening to request on port 8000");
});