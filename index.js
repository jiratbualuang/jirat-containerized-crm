import express from 'express';
import mongoose from 'mongoose';
import jsonwebtoken from "jsonwebtoken";
import routes from './src/routes/crmRoutes.js';

const app = express();
const PORT = 3020;

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/CRMdb');

// bodyparser setup
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

// For parsing application/json
app.use(express.json());
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use((req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', (err, decode) => {
            if(err) req.user = undefined;
            req.user = decode;
            next();
        });      
    } else {
        req.user = undefined;
        next();
    }
});


routes(app);

app.get('/', (req, res, next) => 
    res.send(`Node and express server is running on port ${PORT}`)
);

app.listen(PORT, () => 
    console.log(`Your server is running on port ${PORT}`)
);
