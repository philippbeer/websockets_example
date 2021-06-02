const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8082});

wss.on("connection", ws => {
    ws.on("message", message => {
	try {
	    const data = JSON.parse(message);
	    console.log(data.lat, data.lon);
	} catch(e) {
	    console.log(`Error occurred: ${e.message}`);
	}
    });
});
