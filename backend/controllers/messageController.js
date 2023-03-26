const verifyToken = require("../middleware/verifyToken")
const Message = require("../models/Message")
const messageController = require("express").Router()

// Create(sernd) message
messageController.post("/", verifyToken, async(req, res) => {
    try {
        const {messageText, conversationId} = req.body
        const newMessage = await Message.create({messageText, senderId: req.user.id, conversationId})
        
        return res.status(201).json(newMessage)
    } catch (error) {
        console.error(error)
    }
})
// get all messages from conversation
messageController.get("/:convoid", verifyToken, async(req, res) => {
    try {
        const message = await Message.find({conversationId: req.params.convoid})
        return res.status(200).json(message)
    } catch(error) {
        console.error(error)
    }
})

module.exports = messageController