import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from'cors';
import cookieParser from "cookie-parser";
import { createRequire } from "module";
import BookingRoutes from "./routes/bookingRoutes.js";
import CheckinRoutes from "./routes/checkinRoutes.js";
import { AIAgent } from "./controllers/openai.js";

const require = createRequire(import.meta.url);
mongoose.set("strictQuery", false);
dotenv.config();
var bodyParser = require('body-parser');


const app = require("express")();
const server =require("http").createServer(app);

// const io = require("socket.io")(server, {
// 	cors: {
// 		origin: "*",
// 		methods: [ "GET", "POST" ]
// 	}
// });
// scanImage();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use('/api/bookings',BookingRoutes);
app.use('/api/checkin',CheckinRoutes);
app.use(cookieParser());



const connect = () =>{
  mongoose.connect(process.env.MONGO).then(() =>{
      console.log("connected to DB");
  }).catch((error) => {throw error;});
}
// scanImage();

const PORT = process.env.PORT || 8082;

server.listen(PORT, () => {
  cors:true
  connect();
  console.log("connnected");
  })
app.use((err , req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success:false,
        status,
        message,
    })
})
app.get('/', (req, res) => {
	res.send('Running');
});
app.get('/ping', (req, res) => {
	res.send('ping');
});
app.use('/*', (req, res) => {
	res.send('not found');
});

// AIAgent();