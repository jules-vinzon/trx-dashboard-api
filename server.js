
import express, { json } from "express";
import morgan from "morgan";
import usersRoutes from "./src/routes/users-routes.js";
import transactionRoutes from "./src/routes/transaction-routes.js";
import connectDB from './src/configs/mongodb.js';
import { cronJob } from "./src/configs/cronJob.js";

const app = express();
const port = process.env.PORT;

app.use(json());
app.use(morgan("dev"));

app.use("/api/users", usersRoutes);
app.use("/api/transactions", transactionRoutes);

app.listen(port, () => {


    cronJob();

    connectDB().then(() => {
        console.log('CONNECTED TO MONGODB');
    }).catch(err => console.error(err));

    console.log(`SERVER RUNNING ON http://localhost:${port}`);
});

export default app;
