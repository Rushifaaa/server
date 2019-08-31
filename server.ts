import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as expressIp from 'express-ip';
import * as mongoose from 'mongoose';
import * as geoip from 'geoip-lite';

const port = 3000;
const mongooseConnect = 'mongodb://localhost:27017/api';

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressIp().getIpInfoMiddleware);

const startServer = () => {
    app.listen(port, async (req, res) => {
        console.log("Server is listening on "+ port);
    });
}

export const run = async (mongooseConnectProp) => {
    await mongoose.connect(mongooseConnectProp, {
      autoReconnect: true,
      reconnectTries: 1000000,
      reconnectInterval: 3000,
      useNewUrlParser: true
    })
}

const commands = () => {
    const stdin = process.stdin;
    stdin.resume();
    stdin.setEncoding('utf-8');
    stdin.on('data', (input) => {

        const inputCli = input.toString();
        
        if(inputCli.match('help|\\?')) {
            console.log(
                'help, -, ? -> Shows this Help.\n' +
                '-rs -> Reconnect to MongoDB\n' +
                '-clear, -cls, -ccli -> Clears the Console\n' +
                '-dc, -disconnect, -disconnect (m or M)ongo -> Disconnect from MongoDB => '+ mongooseConnect +'\n' +
                '-c, -connect, -connect (m or M)ongo -> Connect to MongoDB on =>' + mongooseConnect
            );
        } else if(inputCli.match('-rs')) {
            mongoose.disconnect();
            run(mongooseConnect);
        } else if(inputCli.match('-clear|-cls|-ccli')) {
            let i = 0;
            while(i < 200) {
                console.log(" ");
                ++i;
            }
            console.log("-Cleard");
        } else if(inputCli.match('(-dc)|(-disconnect ?(m|(M?)ongo))?')) {
            mongoose.disconnect();
            process.exit();
        }
    })
}

interface UserSchemaInterface extends mongoose.Document {
    user: string,
    password: string,
    email: string
}

const UserSchema = new mongoose.Schema({
    user: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true}
});

const User = mongoose.model<UserSchemaInterface>('User', UserSchema);


mongoose.connection.on('connected', () => {
    console.log('Connected successfully to => '+ mongooseConnect);
    commands();
    startServer();

    app.route('/api/test')
    .get((req, res) => {

        console.log('Headers: ' + JSON.stringify(req.headers));
        console.log('IP: ' + JSON.stringify(req.ip));

        var geo = geoip.lookup(req.ip);

        console.log("Browser: " + req.headers["user-agent"]);
        console.log("Language: " + req.headers["accept-language"]);
        console.log("Country: " + (geo ? geo.country: "Unknown"));
        console.log("Region: " + (geo ? geo.region: "Unknown"));

        console.log(geo);

        res.status(200);
        res.header("Content-Type",'application/json');
        res.end(JSON.stringify({status: "OK - 200"}));




    })
    .post((req, res) => {
        const userName = req.body.user;
        const password = req.body.password;
        const email = req.body.email;
        
        const newUser = new User({
            user: userName,
            password: password,
            email: email,
        });

        newUser.save().then(() => res.sendStatus(200))
        .catch(err => console.error(err));

    });

});

mongoose.connection.on('reconnected', () => {
    console.log('Reconnected successfully to => '+mongooseConnect);
})
mongoose.connection.on('close', () => {
    console.log('Closed connection to => ' + mongooseConnect);
})
mongoose.connection.on('error', () => {
    console.log('Reconnected successfully to => '+ mongooseConnect);
})




run(mongooseConnect).catch(error => console.error(error));