import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';

const port = 3000;
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));


const connect = async () => {
    app.listen(port, async (req, res) => {
        console.log("REQUEST -> "+req+" /RESULT -> "+res);
    });
}
const get = async () => {
    await app.route('/')
        .get(async (req, res) => {
            
        });
}
connect();
get()
