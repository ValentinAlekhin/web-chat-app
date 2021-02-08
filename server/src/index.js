require('dotenv').config()
const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require('./helpers/users')

const PORT = process.env.PORT || 5000

const router = require('./router')

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
  cors: {
    origin: '*',
  },
})

app.use(cors())
app.use(router)

io.on('connection', socket => {
  console.log('Connected', socket.id)
  socket.on('join', ({ name, room }, cb) => {
    const { error, user } = addUser({ id: socket.id, name, room })

    if (error) return cb(error)

    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, welcome to the room ${user.room}`,
    })
    socket.broadcast
      .to(user.room)
      .emit('message', { user: 'admin', text: `${user.name} has joined` })

    socket.join(user.room)

    cb()
  })

  socket.on('sendMessage', (message, cb) => {
    const user = getUser(socket.id)

    io.to(user.room).emit('message', { user: user.name, text: message })

    cb()
  })

  socket.on('disconnected', () => {
    const user = removeUser(socket.id)
    if (user) {
      io.to(user.room).emit('message', {
        user: 'admin',
        text: `${user.name} has left`,
      })
    }
  })
})

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`))
