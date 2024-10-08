const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const route = require("./routes/index.route");
const cors = require("cors");
const db = require("./configs/database.js");
const MQTT = require("./configs/mqtt.js")
const app = express();

app.use(cors());
app.use(bodyParser.json());
db.connect();
MQTT.connectMQTT();
MQTT.handleMessage();
MQTT.handleError();

route(app);
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
