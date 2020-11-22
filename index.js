const express = require('express');
const cors = require('cors');
const app = express();
const { spawn } = require('child_process');

app.use(express.static('./static/public'));
app.use(cors());

app.listen(3050, () => console.log('Happly app on 3050'));
let session = require('express-session');
let bodyParser = require('body-parser');
//let uuid = require('uuid/v1');
//let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');
let http = require('http').createServer(app);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));



app.get('/', (req, res) => {
    res.send("node server request recieved")
})


/*
app.get('/python', (req, res) => {
    const python = spawn('python',['test.py']); 
    python.stdout.on('data',function(data)=> {
        c
    })
})
*/
app.get('/python', (req, res) => {

    var dataToSend;
    // spawn new child process to call the python script
    const python = spawn('python', ['run_model.py', 'Great my anxiety is improving']);
    // collect data from script
    python.stdout.on('data', function(data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        console.log(dataToSend);
        // send data to browser
        res.send(dataToSend)
    });

})

app.get('/ping', (req, res) => {
    console.log('Got pinged');
    return res.send('pong');
})

app.set('views', __dirname + '/static/public/views');
app.set('view engine', 'pug');