const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authController = require('./controllers/authController')
const userController = require('./controllers/userController')
const ConversationRouter = require('./controllers/conversationController')
const messageController = require('./controllers/messageController')
const dotenv = require('dotenv').config()
const app = express()


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to DB Successfully");
  })
  .catch((err) => {
    console.log(err.message);
  });

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use("/auth", authController)
app.use("/user", userController)
app.use("/conversation", ConversationRouter)
app.use("/message", messageController)

app.listen(process.env.PORT, () => console.log(`Server is successfully started`))



