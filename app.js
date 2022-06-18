const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const Http = require('http')
const http = Http.createServer(app)
const socketIo = require('socket.io')
const io = socketIo(http)

app.set('views', 'static')
app.set('view engine', 'pug')

app.use(cors())
app.use(express.static(__dirname))

app.get('/', (req, res) => {
  res.render('index')
})

io.on('connection', function (socket) {
  /* 새로운 유저가 접속했을 경우 다른 소켓에게도 알려줌 */
  socket.on('newUser', (name) => {
    console.log(name + ' 님이 접속하였습니다.')

    /* 소켓에 이름 저장해두기 */
    socket.name = name

    /* 모든 소켓에게 전송 */
    io.emit('update', {
      type: 'connect',
      name: 'SERVER',
      message: name + '님이 접속하였습니다.',
    })
  })

  /* 전송한 메시지 받기 */
  socket.on('message', (data) => {
    /* 받은 데이터에 누가 보냈는지 이름을 추가 */
    data.name = socket.name

    /* 모든 유저에게 메시지 전송 */
    io.emit('update', data)
  })

  /* 접속 종료 */
  socket.on('disconnect', function () {
    console.log(socket.name + '님이 나가셨습니다.')

    /* 나가는 사람을 제외한 나머지 유저에게 메시지 전송 */
    io.emit('update', {
      type: 'disconnect',
      name: 'SERVER',
      message: socket.name + '님이 나가셨습니다.',
    })
  })
})

http.listen(port, () => {
  console.log('서버 켜짐')
})
