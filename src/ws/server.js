import WebSocket, { WebSocketServer } from "ws";

function sendJson (socket, payload){
    if(socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify(payload))
}

function broadCast (wss, payload){
    for (const client of wss.clients){
         if(client.readyState !== WebSocket.OPEN) continue;

         try {
             client.send(JSON.stringify(payload));
         } catch (error) {
             console.error("Failed to send message to client:", error)
         }
    }
}

export function attachWebSocketServer(server){
    const wss = new WebSocketServer({server, path:'/ws', maxPayload: 1024 * 1024 })

    const interval = setInterval(() => {
        wss.clients.forEach((socket) => {

            if(socket.isAlive === false){
                console.log("terminating dead connection")
                socket.terminate()
                return
            }

            socket.isAlive = false  
            socket.ping()          
        })
    }, 30000)

    // clean up interval when server closes
    wss.on('close', () => {
        clearInterval(interval)
    })

    wss.on('connection',(socket)=>{
        socket.isAlive = true                           // mark alive on connect
        socket.on('pong', () => { socket.isAlive = true }) // reset on pong reply

        sendJson(socket, {type: 'welcome'})
        socket.on('error', console.error)
    })

    function broadCastMatchCreated(match){
        broadCast(wss, {type:'match_created', data : match})
    }

    return {broadCastMatchCreated}
}