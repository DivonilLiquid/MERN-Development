const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.getTours = (req, res) =>{                                                           //http method get used to get the infromation
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

exports.getTour = (req, res) =>{                                                            //:id is used to declare a parameter, if you want to declare a set of parameters out of which some are optional then we use ? with that argument
    
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

exports.addTour = (req, res) =>{
    // console.log(req.body);                                                                  req.body has the respone we recived from the client site in form of json                         
    const newId = tours[tours.length-1].id+1;
    const newTour = Object.assign({id: newId},req.body);                                       //two javascript object merged in one
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

exports.updateTour = (req, res) =>{
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


exports.deleteTour = (req, res) =>{
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