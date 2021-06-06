const fs = require('fs');
const superagent = require('superagent');
const readFilePro = file =>{                                                                                // takes one argument
    return new Promise((resolve, reject) =>{                                                                // returns a promise having reject and resolve function
        fs.readFile(file,(err, data) =>{
            if(err) reject(err);                                                                            // if there is an error then we call reject fucntion with argument err
            resolve(data);                                                                                  // else we call resolve fucntion with argument data
        })
    })
}
const writeFilePro = (file,data) =>{                                                                        // takes two argument file and data                           
    return new Promise((resolve, reject) =>{                                                                 // returns a promise having reject and resolve function
        fs.writeFile(file,data,err => {
            if(err) reject('could not write');                                                              // if there is an error then we call reject fucntion with argument string
            resolve('great success');                                                                       // else we call resolve fucntion with argument string
        })
    })
}

//Async and await + then and catch
const getDogimg = async ()=>{
    try{                                                                                                    // try and catch is used in async await for error handling           
        const data = await readFilePro('./dog.txt');                                                        //until and unless this promise gets resolved, the code below it won't get executed
        console.log(`Breed is: ${data}`);

        const response1 =  superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)                // <- returns a promise
        const response2 =  superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)                // <- returns a promise
        const response3 =  superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)                // <- returns a promise
        const all = await Promise.all([response1,response2,response3]);                                     // await untill these all promises gets resolved
        const imgs = all.map(el=>el.body.message);
        console.log(imgs);

        await writeFilePro('./dogs-img.txt',imgs.join('\n'));                                               // <- returns a promise
        console.log('dog img has been added');
    }
    catch(err){                                                                                              // if there is any error in the try block, then it will directly go into the catch block and throm the error
        console.log(err);                                                         
        throw err;                                                                                           // without this, getDogimg won't be marked as rejected promise. Thus won't be able to enter in it's catch
    }
    return '2: ready🐶';
}
// iife
(
    // async interacting with another async function
    async ()=>{
        try{
            const x = await getDogimg();
            console.log('Inside ES6 func',x);
        }
        catch(err){
            console.log('Inside ES6 func 💥');
        }   
    }
)();

// getDogimg().then((string)=>{
//     console.log(string);
// })
// .catch((err)=>{
//     console.log('Error💥');
// })
// const x = getDogimg();
// console.log(x); <- this will return a promise not a string



// //promises -> then catch
// readFilePro('./dog.txt')
// .then((data) =>{
//     console.log(`Breed is: ${data}`);
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`) // <- returns a promise
// }).then((response =>{ // <- then chained at promise
//         console.log(response.body);
//         return writeFilePro('./dogs-img.txt',response.body.message);// <- returns a promise
        
//     })).then(res=>{// <- then chained at promise
//         console.log(res);
//     })
//     .catch((err) =>{    // <- returns a resolved promise with error only and only one is needed
//         console.error(err.message);
//     })







// fs.readFile('./dog.txt',(err, data) => {
//     console.log(`Breed is: ${data}`);
//     superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`) // <- returns a promise
//     .then((response =>{ // <- returns a resolved promise with response only 
//         console.log(response.body);
//         fs.writeFile('./dog-img.txt',response.body.message,err => {
//             if(err) return console.error(err.message);
//             console.log(`file written`);
//         })
//     }))
//     .catch((err) =>{    // <- returns a resolved promise with error only 
//         console.error(err.message);
//     })
//     .end((err, res) => {
//         if(err) return console.error(err.message);
//         console.log(res.body);
//         fs.writeFile('./dog-img.txt',res.body.message,err => {
//             if(err) return console.error(err.message);
//             console.log(`file written`);
//         })
//     })
//     call back method
// })
