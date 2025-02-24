import mqtt from "mqtt";


const brokerUrl = process.env.BROKER_URL;
console.log('[MQTT CONFIG]: CHECK BROKER URL', brokerUrl);

const client = mqtt.connect(brokerUrl);

client.on("connect", () => {
    console.log("[MQTT CONFIG]: CONNECTED TO MQTT BROKER");
});

export const publishMessage = (topic, message) => {
    client.publish(topic, message, { qos: 1, retain: false }, (err) => {
        if (err) {
            console.error("[MQTT CONFIG]: ERROR PUBLISHING:", err);
        } else {
            console.log(`[MQTT CONFIG]: MESSAGE SENT TO ${topic}: ${message}`);
        }
    });
}