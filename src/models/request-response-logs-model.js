import { getDB, ready } from "../configs/mongodb.js";

await ready; 
export class RequestResponseLogsModel {

    constructor() {
        this.collection = getDB().collection("request_response_logs");
    }

    async addLogs(data, logType, requestor, title) {
        try {            
            const logsData = {
                request_id: data.request_id || 'IGNORED',
                payload: data,
                logType,
                requestor,
                title,
                created_at: new Date(),
            }

            this.collection.insertOne(logsData);
            console.error("[ADD LOGS]: SUCCESS");

        } catch (error) {
            console.error("[ADD LOGS]: ERROR ADDING LOGS:", error);
            throw error;
        }
    };
}


