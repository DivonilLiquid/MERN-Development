const express = require('express');
const fs = require('fs');


const app = express();                      //express() is a function which on calling adds bunch of method in app

app.use(express.json());                    //middleware used to modify incoming responses

const port = 3000;

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


app.get('/', (req, res) =>{                 //http method get used to get the infromation
    res.status(200).send('Hello response from server');
})

const getTours = (req, res) =>{                 //http method get used to get the infromation
    res.status(200)
    .json(
        {
            status: 'success', 
            results: tours.length,
            data: {tours}
        }
    );
}

const getTour = (req, res) =>{                 //:id is used to declare a parameter, if you want to declare a set of parameters out of which some are optional then we use ? with that argument
    
    console.log(req.params.id);
    const id = req.params.id*1;
    const tour = tours.find(el=> el.id===id);
    if(!tour){
        return res.status(404)
        .json(
            {
                status: 'fail',
                message: 'Error'
            }
        );
    }
    res.status(200)
    .json(
        {
            status: 'success',
            data: {tour} 
        }
    );
}

const addTour = (req, res) =>{
    // console.log(req.body);                      req.body has the respone we recived from the client site in form of json                         
    const newId = tours[tours.length-1].id+1;
    const newTour = Object.assign({id: newId},req.body); //two javascript object merged in one
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),err=>{
        res.status(201)
        .json(
            {
                status: 'success', 
                data: {newTour}
            }
        );
    })
    //res.send('Done');
}

const updateTour = (req, res) =>{
    const id = req.params.id*1;
    if(id>=tours.length){
        return res.status(404)
        .json(
            {
                status: 'fail',
                message: 'Error'
            }
        );
    }
    res.status(204)
    .json(
        {
            status: 'success',
            message: 'Updated'
        }
    );
}


const deleteTour = (req, res) =>{
    const id = req.params.id*1;
    if(id>=tours.length){
        return res.status(404)
        .json(
            {
                status: 'fail',
                message: 'Error'
            }
        );
    }
    res.status(204)
    .json(
        {
            status: 'success',
            message: 'deleted'
        }
    );
}

// app.get('/api/v1/tours', getTours);

// app.post('/api/v1/tours', addTour);

// app.get('/api/v1/tours/:id', getTour);


// app.patch('/api/v1/tours/:id', updateTour);

// app.delete('/api/v1/tours/:id', deleteTour);


app.route('/api/v1/tours').get(getTours).post(addTour);

app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);




app.listen(port,()=>{                       //used to start the server
    console.log('Hello from server side');
})