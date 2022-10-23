const button = document.getElementById("btn")
const text = document.getElementById("text")
const host = "wss://multi-web-game.herokuapp.com/"
// const host = "ws://localhost:8001/"
const socket = new WebSocket(host)

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext("2d")
const width = canvas.width
const height = canvas.height

const rainbow = ["red", "orange", "green", "blue", "purple"]
const player = new Player(20, 20, 20, 20, rainbow[Math.floor(Math.random() * rainbow.length)], "Anon")
const players = {}


button.addEventListener("click", event => {
    player.name = text.value
})

socket.addEventListener('open', (event) => {
    // socket.send('Hello Server!');
});

socket.addEventListener('message', (event) => {
    evaluateMessage(event.data)
    // console.log('Message from server ', event.data);
});

document.addEventListener('keydown', (event) => {
    const keyName = event.key;

    if (keyName === 'a') {
        player.dx = -10
    }
    if (keyName === 'd') {
        player.dx = 10
    }
    if (keyName === 'w') {
        player.dy = -10
    }
    if (keyName === 's') {
        player.dy = 10
    }
})

document.addEventListener('keyup', (event) => {
    const keyName = event.key;

    if (keyName === 'a') {
        player.dx = 0
    }
    if (keyName === 'd') {
        player.dx = 0
    }
    if (keyName === 'w') {
        player.dy = 0
    }
    if (keyName === 's') {
        player.dy = 0
    }
})

var lastSent = {}
setInterval(() => {
    let data = JSON.stringify({"event": "player", "data": {"player": player}})
    if (socket.readyState == socket.OPEN && lastSent != data) {
        socket.send(data)
    }
    lastSent = data
}, 20)

function evaluateMessage(message) {
    let json_data = JSON.parse(message)
    let event = json_data.event
    let data = json_data.data
    switch (event) {
        case "player" : {
            let id = data.id
            let playerData = data.player
            if (players[id] == undefined) { 
                players[id] = new Player(playerData.x, playerData.y, playerData.w, playerData.h, playerData.color, playerData.name)
            } else {
                players[id].x = playerData.x
                players[id].y = playerData.y
            }
        }
    }
}

function drawPlayer(data) {
    ctx.save()
    ctx.fillStyle = this.color
    ctx.fillRect(data.x, data.y, data.w, data.h)
    ctx.restore()
}

function update() {
    player.update()
}

function draw(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.draw(ctx)
    for (let id in players) {
        players[id].draw(ctx)
    }
}

;(() => {
    function main() {
        window.requestAnimationFrame(main);
        draw(ctx);
        update();
    }
    main();
})();
