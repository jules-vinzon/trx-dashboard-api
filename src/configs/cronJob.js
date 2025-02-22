import cron from "node-cron";
import axios from 'axios';

const pingApi = async () => {
    try {
      const response = await axios.get("https://httpbin.org/anything");
      console.log("[CRON JOB]: API RESPONSE:", response.data);
    } catch (error) {
      console.error("[CRON JOB]: ERROR FETCHING DATA:", error.message);
    }
};
export const cronJob = () => {
    cron.schedule("*/1 * * * *", () => {
        console.log("CRON JOB EXECUTED AT:", new Date().toLocaleString());

        pingApi();
    });
}