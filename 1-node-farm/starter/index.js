const fs = require('fs');
const http = require('http');
const url = require('url');
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
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObject = JSON.parse(data);
const server = http.createServer((req,res)=>{
    const pathName = req.url;
    if(pathName === '/' || pathName === '/overview'){
        res.end('Hello from the overview');
    }
    else if(pathName === '/product'){
        res.end('Hello from product');
    }
    else if(pathName==='/api'){
        res.writeHead(200,{'Content-type':'application/json'});    
        res.end(data);
        // fs.readFile(`${__dirname}/dev-data/data.json`,'utf-8',(err,data)=>{
        //     const productData = JSON.parse(data);
        //     res.writeHead(200,{'Content-type':'application/json'});
        //     //console.log(productData);
        //     res.end(data);
        // });

        //res.end("API");
    }
    else{
        res.writeHead(404,{
            'Content-type':'text/html',
            'my-own-header':'hello-world'
            /*These are Response headers, use to send some metadata about response itself */
        });
        res.end('<h1>404: page not found</h1>');
    }
    
});
server.listen(8000,'127.0.0.1',()=>{
    console.log("Listening to request on port 8000");
});