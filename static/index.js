const socket = io()

/* 접속 되었을 때 실행 */
socket.on('connect', function () {
  const name = prompt('Hello', '')

  if (!name) {
    name = '익명'
  }

  socket.emit('newUser', name)
})

/* 출력 함수 */
socket.on('update', (data) => {
  console.log(`${data.name}: ${data.message}`)
  const box = document.getElementById('box')
  const msg = document.createElement('p')
  msg.innerText = `${data.name}: ${data.message}`
  box.appendChild(msg)
})

/* 전송 함수 */
function send() {
  // 입력되어있는 데이터 가져오기
  const message = document.getElementById('chat').value

  // 가져왔으니 데이터 빈칸으로 변경
  document.getElementById('chat').value = ''

  // 서버로 send 이벤트 전달 + 데이터와 함께
  socket.emit('message', { type: 'message', message: message })
}
