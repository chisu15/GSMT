const mqtt = require("mqtt");
const mssql = require("mssql");
const db = require("../configs/database");
const DataLog = require("../models/datalog.model");
const Device = require("../models/device.model");

const client = mqtt.connect("ws://1.55.212.49:8083/mqtt");

module.exports.connectMQTT = async () => {
	try {
		const topic = "GSMT_DUCKT";

		client.on("connect", () => {
			console.log("Connected to MQTT broker");
			client.subscribe(topic, (err) => {
				if (err) {
					console.error("Error subscribing to topic:", err);
				} else {
					console.log("Subscribed to topic:", topic);
				}
			});
		});
	} catch (error) {
		console.log(error.message);
	}
};

module.exports.handleError = async () => {
	try {
		// Handle errors
		client.on("error", (err) => {
			console.error("MQTT client error:", err);
			client.end();
		});
	} catch (error) {
		console.log(error.message);
	}
};

module.exports.handleMessage = async () => {
	try {
		// Handle incoming messages
		client.on("message", async (topic, message) => {
			try {
				console.log(
					`Received message on topic ${topic}: ${message.toString()}`
				);
				dataOfDevices = JSON.parse(message);
				var res = JSON.parse(message);
				console.log("Check res---->", res);
				var rq2 = new mssql.Request();
				var date = new Date();
				console.log(date);
				console.log("device_y", res.device_id);
				const data = {
					...res,
					// state: "on"
				};
				console.log(data);
				const idDevice = await Device.findByData("device_id", data.device_id)
				console.log(idDevice);
				
				if (!idDevice) {
					throw new Error(`Device with ID ${res.device_id} not found.`);
				}
				const dataCreate = {
					...data,
					device_id: idDevice[0].id,
					description: "",
					state: 1
				}
				console.log(dataCreate);
				
				await DataLog.create(dataCreate);
				console.log("success");
			} catch (error) {
				console.log(error.message);
			}
		});
	} catch (error) {
		console.log(error.message);
	}
};

module.exports.controlLightDevice = async (req, res) => {
	try {
		var { clientid, state } = req.body;
		var message = {
			clientid: clientid,
			state: parseInt(state),
		};

		var message_send = JSON.stringify(message);
		console.log(req.body);
		if (req.body.state == 1) {
			res.send({
				desc: "Bật đèn thành công",
				code: 200,
			});
		} else {
			res.send({
				desc: "Tắt đèn thành công",
				code: 200,
			});
		}
		client.publish("Demo_lightControl", message_send);
	} catch (error) {
        res.status(500).send({
            error: error.message,
            code: 500,
        });
    }
};
