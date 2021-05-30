const fs = require('fs');
const http = require('http');
const url = require('url');


// we have to set 2 html pages
// which are overview and for each product
const tempOverview = fs.readFileSync('./templates/template-overview.html','utf-8');
const tempProduct = fs.readFileSync('./templates/template-product.html','utf-8');
const GeneralData = fs.readFileSync('./templates/template-general-forAll.html','utf-8');

// we have a javascript object which has all values needed
// jsonData is javascript object converted by json file
const data = fs.readFileSync('./dev-data/data.json','utf-8');
const jsonData = JSON.parse(data); 
const replaceValues = (template,data)=> {
    let duplicate = template;
    duplicate = duplicate.replace(/{%PRODUCTIMAGE%}/g,data.image);
    duplicate = duplicate.replace(/{%PRODUCTNAME%}/g,data.productName);
    duplicate = duplicate.replace(/{%PRODUCTQUANTITY%}/g,data.quantity);
    duplicate = duplicate.replace(/{%PRODUCTPRICE%}/g,data.price);
    duplicate = duplicate.replace(/{%PRODUCTDESCRIPTION%}/g,data.description);
    duplicate = duplicate.replace(/{%PRODUCTNUTRIENTS%}/g,data.nutrients);
    duplicate = duplicate.replace(/{%PRODUCTFROM%}/g,data.from);
    duplicate = duplicate.replace(/{%ID%}/g,data.id);
    if(data.organic===false){
        duplicate = duplicate.replace(/{%NOT-ORGANIC%}/g,'not-organic');
        // adding not-organic class to divs which are not organic
    }
    return duplicate;
}
// creating a server now
const server = http.createServer((req, res)=>{
    //res = is nothing but response object whereas req.url specifies the exact url which user is expecting
    const pathName = req.url;
    const {query,pathname} = url.parse(req.url,true);   //Destructruing
    // console.log(reqUrl);
    if(pathname === '/' || pathname === '/overview'){

        res.writeHead(202,{'content-type': 'text/html'});
        // for each el in jsonData object we will change the data
        const outputFunction = jsonData.map(el=> replaceValues(GeneralData,el));
        const output = tempOverview.replace(/{%TEMPLATEMADEFORTHIS%}/g,outputFunction);
        res.end(output);
    }
    else if(pathname === '/product'){
        res.writeHead(202,{'Content-type':'text/html'});   
        const product = jsonData[query.id];
        // only sending that object from json converted file, which is being clicked and asked info for
        const output = replaceValues(tempProduct,product);
        res.end(output);
    }
    else if (pathname === '/api'){
        res.writeHead(202,{'content-type': 'application/json'});
        res.end(data);
    }
    else{
        res.writeHead(404,{'content-type': 'text/html'});
        // notice here that sending backend response in form of html string does the same work 
        res.end('<h1>404 not found</h1>');
    }
});
server.listen(8000, '127.0.0.1');



// we have to set 2 html pages
// which are overview and for each product
// we have a javascript object which has all values needed
// so for each value of that object we will change it's sub-ordinates value in overview
// for each product from that object we will change it's sub-ordinates value in product
// replace it and send it as a response
// finally done



// // Sync Way
// const read1 = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(read1);
// // Async way
// const read = fs.readFile('./txt/input.txt','utf-8',(err, data) =>{
//     console.log(data);
// })