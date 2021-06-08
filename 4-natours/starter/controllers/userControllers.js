const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.getUsers = (req, res) =>{
    res.status(500).send({
        status: 'fail',
        message: 'server not defined'
    })
}
exports.addUser = (req, res) =>{
    res.status(500).send({
        status: 'fail',
        message: 'server not defined'
    })
}
exports.getUser = (req, res) =>{
    res.status(500).send({
        status: 'fail',
        message: 'server not defined'
    })
}
exports.updateUser = (req, res) =>{
    res.status(500).send({
        status: 'fail',
        message: 'server not defined'
    })
}
exports.deleteUser = (req, res) =>{
    res.status(500).send({
        status: 'fail',
        message: 'server not defined'
    })
}
