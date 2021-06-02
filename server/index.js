const WebSocket = require("ws");
const yup = require("yup");

const wss = new WebSocket.Server({ port: 8082});

/*
* Collection of "yup" event schemas for each event type.
*
* @type {Object.<string, yup.Schema>}
*/
const yupEventSchemas = {
    "PLAYER_MOVEMENT": yup.object().shape({
	lat: yup.number().required(),
	lon: yup.number().required()
    })
};

/*
* Validates and parses and incoming messasge to ensure it is in the form
* of JSON and the schema is OK.
*
* @param {string} message A WebSocket message received from the client
* @returns {{event: string, payload: object}}
* @throws Will throw an erro if message is invalid
*/
function parseMessage(message) {
    const object = JSON.parse(message);

    if (!("event" in object)) {
	throw new Error("Event property not provided!"); 
    }

    if (!("payload" in object)) {
	throw new Error("Payload property not provided!");
    }

    object.payload = yupEventSchemas[object.event].validateSync(object.payload);

    return object;
}

wss.on("connection", ws => {
    console.log('client connected');

    ws.on("message", message => {
	let data;

	try {
	    data = parseMessage(message);
	} catch (err) {
	    console.log(`INVALID MESSAGE: ${err.message}`);
	    return;
	}

	console.log(data);

	switch(data.event) {
	case "PLAYER_MOVEMENT":
	    console.log("received player movement");
	    break;
	    
	}
    });
});
