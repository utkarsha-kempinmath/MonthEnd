
const express = require("express")
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const { errorMiddleware } = require("./errors/error")
const authRouter = require('./routes/authRoute')
const homeRouter = require('./routes/homeRoute')
const cookieParser = require("cookie-parser");




dotenv.config({path: './config/config.env'});

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/api/auth', authRouter)
app.use('/api/home', homeRouter)


app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(errorMiddleware)
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "MonthEnd"
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

 
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is connected!" });
});
 
app.listen(process.env.PORT, () => {
  console.log(`Backend running on ${process.env.PORT}`);
});
