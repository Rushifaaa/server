import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';

const port = 3000;
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));

const startServer = () => {
    app.listen(port, async (req, res) => {
        console.log("REQUEST -> "+req+" /RESULT -> "+res);
    });
}
mongoose.connect('127.0.0.1:27017/api')
    .then(() => {
        console.log("Test");
        startServer()
    })
    .then(() => console.log("Test"))
    .catch(Error);





const get = async () => {
    await app.route('/')
        .get(async (req, res) => {

        });
}
get()
