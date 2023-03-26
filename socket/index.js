const io = require('socket.io')(8080, {
    cors:{
        origin: `http://localhost:3000`
    }
})

let users = []

function addUser(userId, socketId){
    !users.some((user) => user.userId === userId) &&
    users.push({userId, socketId})
    console.log(users, 'USERS')
}

function removeUser(socketId) {
    users = users.filter((user) => user.socketId !== socketId)
}

function getUserById(userId) {
    return users.find((user) => user.userId === userId )
}

io.on('connection', (socket) => {
    socket.on('addUser', (userId) => {
        addUser(userId, socket.id)
    })

    socket.on('sendMessage', ({senderId, otherUserId, text}) => {
        const user = getUserById(otherUserId)
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
        })
    })

    socket.on('disconnect', () => {
        removeUser(socket.id)
    })

   
})