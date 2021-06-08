const app = require('./app')
const port = 3000;
// 1) Server start

app.listen(port,()=>{                       //used to start the server
    console.log('Hello from server side');
})