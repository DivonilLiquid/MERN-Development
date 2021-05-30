const fs = require('fs');
const http = require('http');
const url = require('url');


/*          Server           */
const replaceTemplate = (temp,product) =>{
    let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    //in temp string wherever you find PRODUCTNAME, replace it into productName

    output = output.replace(/{%PRODUCTIMAGE%}/g,product.image);
    output = output.replace(/{%PRODUCTPLACENAME%}/g,product.from);
    output = output.replace(/{%NUTRIENTNAME%}/g,product.nutrients);
    output = output.replace(/{%QUANTITYNAME%}/g,product.quantity);
    output = output.replace(/{%PRICE%}/g,product.price);
    output = output.replace(/{%DESCRIPTION%}/g,product.description);
    output = output.replace(/{%IMAGE%}/g,product.image);
    output = output.replace(/{%QUANTITY%}/g,product.quantity);
    output = output.replace(/{%ID%}/g,product.id);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    //same procedure is being performed 9 times more to convert output string into desired html string

    return output;
}
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
// tempCard has all the html in string format from template-card;
// tempProduct has all the html in string format from template-product;
// tempOverview has all the html in string format from template-overview;


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
// storing content of json file in data which converted in javascript object and stored in dataObject

const dataObject = JSON.parse(data);
const server = http.createServer((req,res)=>{
    const pathName = req.url;
    /**console.log(req.url); => /product?id=0 */



    const {query,pathname} = url.parse(req.url,true);   //Destructruing
    console.log(query,pathname);


    /*Overview page*/
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200,{'Content-type':'text/html'});   
        const cardHtml = dataObject.map(el => replaceTemplate(tempCard,el)).join(''); 
        // cardHtml is string which has html code embedded in it.

        const output = tempOverview.replace('{%PRODUCT-CARD%}',cardHtml);
        res.end(output);
    }


    /*Product Page */
    else if(pathname === '/product'){
       // console.log(query);

       res.writeHead(200,{'Content-type':'text/html'});   
        const product = dataObject[query.id];
        // only sending that object from json converted file, which is being clicked and asked info for

        const output = replaceTemplate(tempProduct,product);
        res.end(output);
        // res.end is used to send the output to the client site by mentioning of res.writeHead(200,{'Content-type':'text/html'});   
    }


    /*API */
    else if(pathname==='/api'){
        res.writeHead(200,{'Content-type':'application/json'});    
        //res.end(data);
        // fs.readFile(`${__dirname}/dev-data/data.json`,'utf-8',(err,data)=>{
        //     const productData = JSON.parse(data);
        //     res.writeHead(200,{'Content-type':'application/json'});
        //     //console.log(productData);
        //     res.end(data);
        // });

        //res.end("API");
    }


    /**Not found */
    else{
        res.writeHead(404,{
            'Content-type':'text/html',
            'my-own-header':'hello-world'
            /*These are Response headers, use to send some metadata about response itself */
        });
        res.end('<h1>404: page not found</h1>');
        // see we are sending string html in form of output format
    }
    
});
server.listen(8000,'127.0.0.1',()=>{
    console.log("Listening to request on port 8000");
    // server starts from here 💻
});