const verifyToken = require("../middleware/verifyToken")
const Conversation = require("../models/Conversation")
const ConversationRouter = require("express").Router()

// create conversation
ConversationRouter.post("/", verifyToken, async(req, res) => {
    try {
        const { receiverId } = req.body
        const currentUserId = req.user.id
        const isConvoAlreadyCreated = await Conversation.findOne({ members: {$all: [receiverId, currentUserId]}})
        if(isConvoAlreadyCreated) {
            return res.status(500).json({msg: "There is already a conversation"})
        } else {
            await Conversation.create({members: [currentUserId, receiverId]})
            return res.status(201).json({msg: "Conversation is successfully created"})
        }
    } catch (error){
        console.error(error)
    }
})
// get user conversation with its ID
ConversationRouter.get("/find/:userId", verifyToken, async(req, res) => {
    if(req.user.id === req.params.userId) {
        try {
            const currentUserId = req.user.id
            const conversations = await Conversation.find({ members: {$in: [currentUserId]}})

            return res.status(200).json(conversations)
        } catch (error) {
            console.error(error)
        }
    } else {
        return res.status(403).json({ msg: "You can get only your own conversations."})
    }
})


// get a single conversation
ConversationRouter.get("/:convoId", verifyToken, async(req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.convoId)
        if (conversation.members.includes(req.user.id)){
            return res.status(200).json(conversation)
        } else {
            return res.status(403).json({msg: "This conversation does not include you"})
        }
    } catch (error) {
        console.error(error)
    }
})

module.exports = ConversationRouter