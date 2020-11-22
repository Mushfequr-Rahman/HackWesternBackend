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
    let resultData = { result: "pong" }
    console.log('Got pinged sending Data: ', resultData);
    res.json([resultData]);
})

app.get("/showtimes", (req, res, next) => {
    res.json([{ id: 'tt0059742', detailsURL: '/movieDetails?id=tt0059742', title: 'The Sound of Music', times: ['7:15pm', '8:40pm'] },
        { id: 'tt0059113', detailsURL: '/movieDetails?id=tt0059113', title: 'Doctor Zhivago', times: ['7:35pm', '8:10pm', '9:05pm'] },
        { id: 'tt0059243', detailsURL: '/movieDetails?id=tt0059243', title: 'The Great Race', times: ['6:45pm', '9:15pm'] },
        { id: 'tt0059578', detailsURL: '/movieDetails?id=tt0059578', title: 'For a Few Dollars More', times: ['8:05pm', '9:40pm'] },
        { id: 'tt0059661', detailsURL: '/movieDetails?id=tt0059661', title: 'The Rounders', times: ['4:10pm'] },
        { id: 'tt0059800', detailsURL: '/movieDetails?id=tt0059800', title: 'Thunderball', times: ['8:00pm'] }
    ]);
})


app.set('views', __dirname + '/static/public/views');
app.set('view engine', 'pug');