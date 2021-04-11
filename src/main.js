const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var Validator = require('jsonschema').Validator;
var v = new Validator();
const fichierSchema = require('./validator_schema/schemas.js')


const app = express();
const host = 'localhost'; // Utiliser 0.0.0.0 pour être visible depuis l'exterieur de la machine
const port = 8000;

const ACCESS_TOKEN_SECRET = "123456789";
const ACCESS_TOKEN_LIFE = 120;



function login(data,res) {
    console.log("login");
    var loginValidation = v.validate(data, fichierSchema.loginSchema);
    if (loginValidation.valid) {

        console.log('Username:', data.username, 'Passwd:', data.password);

        if (data.username == "test" && data.password == "pass") {
            let j = jwt.sign({"username": data.username}, ACCESS_TOKEN_SECRET, {
                algorithm: "HS512",
                expiresIn: ACCESS_TOKEN_LIFE
            });
            // Reply to client as error code 200 (no error in HTTP); Reply data format is json
            res.writeHead(200, {'Content-Type': 'application/json'});
            // Send back reply content
            res.end(JSON.stringify({"error": 0, "message": j}));
        } else {
            // Reply to client as error code 200 (no error in HTTP); Reply data format is json
            res.writeHead(401, {'Content-Type': 'application/json'});
            // Send back reply content
            res.end(JSON.stringify({"error": -1, "message": "login error"}));
        }
    }else{
        // Reply to client as error code 200 (no error in HTTP); Reply data format is json
        res.writeHead(401, {'Content-Type': 'application/json'});
        // Send back reply content
        res.end(JSON.stringify({"error": -1, "message": "data login input invalid"}));
    }
}

function postdata(data,res) {

    var loginValidation = v.validate(data, fichierSchema.pushDataSchema);
    console.log(loginValidation);
    if (loginValidation.valid) {

        console.log("Post Data", data);
        // Check JWT validity
        jwt.verify(data.jwt, ACCESS_TOKEN_SECRET, function (err, decoded) {
            if (err) { // There is an error: invalid jwt ...
                res.writeHead(401, {'Content-Type': 'application/json'});
                // Send back reply content
                res.end(JSON.stringify({"error": -1, "message": "JWT error"}));
            } else {
                // Ok no problem: Adding data
                res.writeHead(201, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({"error": 0, "message": "data added"}));
            }
        });
    }else{
        res.writeHead(401, {'Content-Type': 'application/json'});
        // Send back reply content
        res.end(JSON.stringify({"error": -1, "message": "data input postdata invalid (not a string)"}));
    }
}


/**
 *
 * Occur when an unkown url was called
 *
 */
function f404(data,res) {
    res.setHeader('Content-Type', 'application/json');
    res.status(404);
    res.end(JSON.stringify({"error":-1,"message":"404"}));
}


function run() {

    app.use(bodyParser.json());

    app.post('/pushdata', (req, res) => {
        var body = req.body;
        console.log(body);
        postdata(body,res);
    });

    app.post("/login", (req, res) => {
        var body = req.body;
        console.log(body);
        login(body,res);
    });

    app.get('/*', (req, res) => {
        console.log("GET 404", req.originalUrl);
        f404(null,res);
    });
    app.post('/*', (req, res) => {
        console.log("POST 404",req.originalUrl);
        f404(null,res);
    });

    app.listen(port, host, () => {
        console.log(`Server is running at http://${host}:${port}`);
    });
}


exports.run = run;
