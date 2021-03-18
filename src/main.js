const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const host = 'localhost'; // Utiliser 0.0.0.0 pour être visible depuis l'exterieur de la machine
const port = 8000;



function run() {

    app.use(bodyParser.json());

    app.get('/data', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        res.end(JSON.stringify({"message": "DATA"}));
    });

    app.post("/login", (req, res) => {
        var body = req.body;
        console.log(body);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({"message": 'POST request for ' + body.email + ' and ' + body.username}));

    });

    app.get('/*', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(404);
        res.end(JSON.stringify({"message": "The URL " + req.originalUrl + " doesn't exist"}));
    });

    app.listen(port, host, () => {
        console.log(`Server is running at http://${host}:${port}`);
    });
}


exports.run = run;
