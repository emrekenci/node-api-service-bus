const express        = require('express');
const azure          = require('azure');
const app            = express();
const port           = 5000;
const HOST           = '0.0.0.0';

app.use(express.json()) 

app.listen(port, () => {
    
    var sbConnectionString = process.env.AZURE_SERVICEBUS_CONNECTION_STRING;

    var queueName = process.env.AZURE_SERVICEBUS_QUEUE_NAME;

    if (!sbConnectionString) {
        console.error("AZURE_SERVICEBUS_CONNECTION_STRING environment variable must be set")
        process.exit(-1);
    }

    console.log("Service bus instance: " + sbConnectionString);

    if (!queueName) {
        console.error("AZURE_SERVICEBUS_QUEUE_NAME environment variable must be set")
        process.exit(-1);
    }

    console.log("Queue name: " + queueName);

    console.log("Listening on port: " + port);
});

app.put('/messages/normal', (req, res) => {

    var serviceBusService = azure.createServiceBusService();

    var message = {
        body: JSON.stringify(req.body),
    };
    
    var queueName = process.env.AZURE_SERVICEBUS_QUEUE_NAME;

    serviceBusService.sendQueueMessage(queueName, message, function(error){
        if(!error){
            res.send("ok")
        }
        else {
            console.log("Error writing message to queue: " + error)
        }
    });
});