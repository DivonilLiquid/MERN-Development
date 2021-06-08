const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();                      //express() is a function which on calling adds bunch of method in app

const port = 3000;

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


// 1) Middleware

app.use(morgan('dev'));   //Concise output colored by response status for development use. The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes. 

app.use(express.json());                    //middleware used to modify incoming responses

app.use((req, res, next)=>{
    console.log('Hello from own middleware 👋🏻');
    req.requestTime = new Date().toISOString(); // new Date() is a constructor
    next(); //very important to implement next stacked middlewares
})

app.get('/', (req, res) =>{                 //http method get used to get the infromation
    res.status(200).send('Hello response from server');
})

// 2) Route Handlers 

const getTours = (req, res) =>{                 //http method get used to get the infromation
    res.status(200)
    .json(
        {
            status: 'success', 
            requestTime: req.requestTime,
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

const getUsers = (req, res) =>{
    res.status(500).send({
        status: 'fail',
        message: 'server not defined'
    })
}
const addUser = (req, res) =>{
    res.status(500).send({
        status: 'fail',
        message: 'server not defined'
    })
}
const getUser = (req, res) =>{
    res.status(500).send({
        status: 'fail',
        message: 'server not defined'
    })
}
const updateUser = (req, res) =>{
    res.status(500).send({
        status: 'fail',
        message: 'server not defined'
    })
}
const deleteUser = (req, res) =>{
    res.status(500).send({
        status: 'fail',
        message: 'server not defined'
    })
}


// app.get('/api/v1/tours', getTours);

// app.post('/api/v1/tours', addTour);

// app.get('/api/v1/tours/:id', getTour);


// app.patch('/api/v1/tours/:id', updateTour);

// app.delete('/api/v1/tours/:id', deleteTour);

// 3) Routes

//data
app.route('/api/v1/tours').get(getTours).post(addTour);

app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

//Users
app.route('/api/v1/users').get(getUsers).post(addUser);

app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);



// 4) Server start
app.listen(port,()=>{                       //used to start the server
    console.log('Hello from server side');
})