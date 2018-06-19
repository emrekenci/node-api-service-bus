const express        = require('express');
const azure          = require('azure-sb');
const app            = express();
const port           = 5000;

if (!process.env.AZURE_SERVICEBUS_CONNECTION_STRING) {
    console.error("AZURE_SERVICEBUS_CONNECTION_STRING environment variable must be set")
    process.exit(-1);
}

if (!process.env.AZURE_SERVICEBUS_QUEUE_NAME) {
    console.error("AZURE_SERVICEBUS_QUEUE_NAME environment variable must be set")
    process.exit(-1);
}

const serviceBusService = azure.createServiceBusService();

app.use(express.json()) 

app.listen(port, () => {
    console.log("All good... Listening on port: " + port);
});

app.get('', (req, res) => {
    return res.send("ok")
});

app.put('/messages/normal', (req, res) => {

    var message = {
        body: JSON.stringify(req.body),
    };
    
    var queueName = process.env.AZURE_SERVICEBUS_QUEUE_NAME;

    serviceBusService.sendQueueMessage(queueName, message, function(error){
        if(!error){
            return res.send("ok")
        }
        else {
            console.error("Error writing message to queue: " + error)
            return res.status(500).send('Something went wrong')
        }
    });
});