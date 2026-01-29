const express = require("express")
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const { errorMiddleware } = require("./errors/error")
const userRouter = require('./routes/userRoute')

dotenv.config({path: './config/config.env'});

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/api/user', userRouter)

app.use( //mongodb+srv://utkarshakempinmath1725_db_user:<db_password>@cluster0.tqmpcbm.mongodb.net/?appName=Cluster0
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(errorMiddleware)
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "UnFold"
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

 
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is connected!" });
});
 
app.listen(process.env.PORT, () => {
  console.log(`Backend running on ${process.env.PORT}`);
});
