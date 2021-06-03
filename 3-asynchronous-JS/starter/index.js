const fs = require('fs');
const superagent = require('superagent');
const readFilePro = file =>{
    return new Promise((resolve, reject) =>{
        fs.readFile(file,(err, data) =>{
            if(err) reject(err);
            resolve(data);
        })
    })
}
const writeFilePro = (file,data) =>{
    return new Promise((resolve, reject) =>{
        fs.writeFile(file,data,err => {
            if(err) reject('could not write');
            resolve('great success');
        })
    })
}

//Async and await + then and catch
const getDogimg = async ()=>{
    try{
        const data = await readFilePro('./dog.txt');
        console.log(`Breed is: ${data}`);

        const response1 =  superagent.get(`https://dog.ceo/api/breed/${data}/images/random`) // <- returns a promise
        const response2 =  superagent.get(`https://dog.ceo/api/breed/${data}/images/random`) // <- returns a promise
        const response3 =  superagent.get(`https://dog.ceo/api/breed/${data}/images/random`) // <- returns a promise
        const all = await Promise.all([response1,response2,response3]);
        const imgs = all.map(el=>el.body.message);
        console.log(imgs);

        await writeFilePro('./dogs-img.txt',imgs.join('\n'));// <- returns a promise
        console.log('dog img has been added');
    }
    catch(err){
        //console.log(err);
        throw err; // without this, getDogimg won't be marked as rejected promise. Thus won't be able to enter in it's catch
    }
    return '2: ready🐶';
}

(
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







// // fs.readFile('./dog.txt',(err, data) => {
// //     console.log(`Breed is: ${data}`);
// //     superagent
// //     .get(`https://dog.ceo/api/breed/${data}/images/random`) // <- returns a promise
// //     .then((response =>{ // <- returns a resolved promise with response only 
// //         console.log(response.body);
// //         fs.writeFile('./dog-img.txt',response.body.message,err => {
// //             if(err) return console.error(err.message);
// //             console.log(`file written`);
// //         })
// //     }))
// //     .catch((err) =>{    // <- returns a resolved promise with error only 
// //         console.error(err.message);
// //     })
// //     // .end((err, res) => {
// //     //     if(err) return console.error(err.message);
// //     //     console.log(res.body);
// //     //     fs.writeFile('./dog-img.txt',res.body.message,err => {
// //     //         if(err) return console.error(err.message);
// //     //         console.log(`file written`);
// //     //     })
// //     // })
// //     // call back method
// // })
