import WebSocket, { WebSocketServer } from "ws";
import { wsArcjet } from "../arcjet.js";

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

    wss.on('connection',async (socket,req)=>{
        if(wsArcjet){
            try{
                const decision = await wsArcjet.project(req)
                if(decision.isDenied()){
                    const code = decision.reason.isRateLimit()? 1013 : 1008
                    const reason = decision.reason.isRateLimit() ? 'Rate limit Exeeded': 'Access denied'
                    socket.close(code,reason)
                    return
                }
            }catch(e){
                console.error('WS connection error',e)
                socket.close(1011,'server security error')
                return
            }
        }
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


