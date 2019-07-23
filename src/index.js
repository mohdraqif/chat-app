// " on " -> data "in" to a system
// " emit " -> data "out" from a system
// " io " -> data transfer to all systems

const express = require('express')
const app = express()
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage }=  require('./utils/messages')
const port = process.env.PORT || 3000


const server = http.createServer(app)  //creates a new http server
const io = socketio(server)            //converts 'that' server into websocket server

app.use(express.static(path.join(__dirname, '../public')))


io.on('connection', (socket) =>{

    socket.emit('message', generateMessage('Welcome!'))
    socket.broadcast.emit('message', generateMessage('mohd.raqif joined the conversation!'))

    socket.on('sendMessage', (message, callback) =>{
        const filter = new Filter()

        if(filter.isProfane(message)) {
            return callback("Be Careful With Your Words!")
        }
        
        io.emit('message', generateMessage(message))
        callback()
    }) 

    socket.on('location', (coords, callback) =>{
        io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}.` )
        callback()
    })

    socket.on('disconnect', () =>{
        io.emit('message', generateMessage('mohd.raqif left the conversation!'))
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})