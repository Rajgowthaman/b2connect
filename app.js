const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const env = require('dotenv');
const path = require('path');
const app = express();
const { log, setSessionId } = require('./src/utils/logger');
const constants = require('./src/utils/constants');
const coreRoutes = require('./src/routes/coreRoutes');
const webRoutes = require('./src/routes/webRoutes');
const WebSocketServer = require('ws');
const { time } = require('console');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secretKey',
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 900000, //15 mins
    },
    rolling: true
}));
mongoose.connect(constants.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
 
const wss = new WebSocketServer.Server({ port: 8085 })
wss.on("connection", ws => {
    ws.send(JSON.stringify([
        ['EUR', randomNumber(35000,37000), randomNumber(35000,37000), randomNumber(37000,39000), randomNumber(39000,41000)],
        ['USD', randomNumber(45000,47000), randomNumber(45000,47000), randomNumber(47000,49000), randomNumber(49000,51000)],
        ['GBP', randomNumber(32000,34000), randomNumber(34000,36000), randomNumber(36000,38000), randomNumber(38000,40000)],
      ]));
    setInterval(function () {
        ws.send(JSON.stringify([
            ['EUR', randomNumber(35000,37000), randomNumber(35000,37000), randomNumber(37000,39000), randomNumber(39000,41000)],
            ['USD', randomNumber(45000,47000), randomNumber(45000,47000), randomNumber(47000,49000), randomNumber(49000,51000)],
            ['GBP', randomNumber(32000,34000), randomNumber(34000,36000), randomNumber(36000,38000), randomNumber(38000,40000)],
          ]));
    }, 5000);
    console.log("new client connected");
    // sending message
    ws.on("message", data => {
        console.log(`Client has sent us: ${data}`)
    });
    // handling what to do when clients disconnects from server
    ws.on("close", () => {
        console.log("the client has connected");
    });
    // handling client connection error
    ws.onerror = function () {
        console.log("Some Error occurred")
    }
});
console.log("The WebSocket server is running on port 8085");

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use("/",setSessionId);
app.use("/web", webRoutes)
app.use('/core', coreRoutes);
//require('routes')(app);

console.log("constants.PORT :: "+constants.PORT)
app.listen(constants.PORT, () => {
    log.info('App started on port ' + constants.PORT);
});


function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}





