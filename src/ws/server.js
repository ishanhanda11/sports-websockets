import WebSocket, { WebSocketServer } from "ws";
<<<<<<< HEAD


=======
import { wsArcjet } from "../arcjet.js";
>>>>>>> 9b2afa17b777dc93e96755018a4a086a8cb21338

function sendJson (socket, payload){
    if(socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify(payload))
}

function broadCast (wss, payload){
<<<<<<< HEAD
   
=======
>>>>>>> 9b2afa17b777dc93e96755018a4a086a8cb21338
    for (const client of wss.clients){
         if(client.readyState !== WebSocket.OPEN) continue;

         try {
             client.send(JSON.stringify(payload));
         } catch (error) {
             console.error("Failed to send message to client:", error)
         }
    }
}
<<<<<<< HEAD
const matchSubscribers = new Map()
const matchHistory = new Map()

//SUSBSCRIBE
function subscribe (matchId, socket){
    if (socket.subscriptions.size >= 10) return 'limit_reached'
    if (socket.subscriptions.has(matchId)) return 'already_subscribed'
    if(!matchSubscribers.has(matchId)){
        matchSubscribers.set(matchId, new Set())
    }
    
    matchSubscribers.get(matchId).add(socket)
   
    socket.subscriptions.add(matchId)
    const history = matchHistory.get(matchId)
    if(history && history.length > 0){
        sendJson(socket, { type: 'history', matchId, messages: history })
    }

    return 'ok'
}

//UNSUBSCRIBE
function unsubscribe(matchId, socket) {
    const subscribers = matchSubscribers.get(matchId)

    if (!subscribers) return

    subscribers.delete(socket)

    if (subscribers.size === 0) {
        matchSubscribers.delete(matchId)
    }
}

//MATCH BROADCAST
function matchBroadcast(matchId, payload){
    const subscribers = matchSubscribers.get(matchId)
    const message = JSON.stringify(payload)
    if(!subscribers || subscribers.size === 0) return
    if(!matchHistory.has(matchId)){
        matchHistory.set(matchId, [])
    }
    const history = matchHistory.get(matchId)
    history.push(payload)
    if(history.length > 10){
        history.shift()
    }
    subscribers.forEach((subscriber)=>{
        if(subscriber.readyState === WebSocket.OPEN){
           subscriber.send(message)
        }
    })
}


function cleanupSubscribers (socket, reason='disconnected'){
    console.log(`Client ${reason}, clientId: ${socket.clientId} Was subscribed to ${socket.subscriptions.size} matches: ${[...socket.subscriptions].join(', ')}`)
        
    for(const matchId of socket.subscriptions){
        unsubscribe(matchId,socket)
    }
    
}

//MESSAGE HANDLING
function handleMessage (socket, data){
    if (Date.now() - socket.windowStart > 10000) {
        socket.windowStart = Date.now()
        socket.messageCount = 0
    }

    socket.messageCount += 1

    if (socket.messageCount > 5) {
        sendJson(socket, { type: 'error', message: 'rate limit exceeded, slow down' })
        return
    }

    let message;

    try{
        message = JSON.parse(data.toString())
        
    }catch(e){
        sendJson(socket,{type: 'error', message: 'invalid JSON'})
        return
    }
    if(message?.type === 'subscribe'){
       
        const result = subscribe(message.matchId, socket)
        if (result === 'limit_reached') {
        sendJson(socket, { type: 'error', message: 'subscription limit reached' })
        return
        }
        if (result === 'already_subscribed') {
        sendJson(socket, { type: 'error', message: 'already subscribed to this match' })
        return
        }
       
        sendJson(socket, {type:'subscribed', matchId:message.matchId})
        
    }
    else if(message?.type === 'unsubscribe'){
        unsubscribe(message.matchId, socket)
        socket.subscriptions.delete(message.matchId)
        sendJson(socket,{type:'unsubscribed', matchId: message.matchId})
        
    }
    else{
        sendJson(socket,{type:'error',message:"Unknown message Type"})
    }
}


export function attachWebSocketServer(server){
    const wss = new WebSocketServer({server, path:'/ws', maxPayload: 1024 * 1024 })
    
=======

export function attachWebSocketServer(server){
    const wss = new WebSocketServer({server, path:'/ws', maxPayload: 1024 * 1024 })

>>>>>>> 9b2afa17b777dc93e96755018a4a086a8cb21338
    const interval = setInterval(() => {
        wss.clients.forEach((socket) => {

            if(socket.isAlive === false){
<<<<<<< HEAD
                console.log(`terminating the dead connection with Id:${socket.clientId}, was subscribed to ${socket.subscriptions.size}: ${[...socket.subscriptions].join(', ')} `)
                cleanupSubscribers(socket,'terminated (dead connection)')
=======
                console.log("terminating dead connection")
>>>>>>> 9b2afa17b777dc93e96755018a4a086a8cb21338
                socket.terminate()
                return
            }

            socket.isAlive = false  
<<<<<<< HEAD
            socket.ping()
            
=======
            socket.ping()          
>>>>>>> 9b2afa17b777dc93e96755018a4a086a8cb21338
        })
    }, 30000)

    // clean up interval when server closes
    wss.on('close', () => {
        clearInterval(interval)
    })

    wss.on('connection',async (socket,req)=>{
<<<<<<< HEAD
        const clientId = Date.now() + Math.random()
        const totalClients = wss.clients.size
        socket.messageCount = 0 // it is for setting only 5 messages per 10 seconds
        socket.windowStart = Date.now() // it is for checking whether 10 seconds have passed or not
        socket.clientId = clientId
        socket.isAlive = true 
        socket.subscriptions = new Set()                          
        socket.on('pong', () => { socket.isAlive = true }) 
        console.log(`client connected. ClientId: ${clientId}, total connected: ${totalClients}`)
        sendJson(socket, {type: 'welcome', clientId: clientId, totalClients: totalClients})
        socket.on('error', console.error)
        socket.on('message',(data)=>{
            handleMessage(socket,data)
        })
        socket.on('close',()=>{
            cleanupSubscribers(socket)
    })
})
=======
        if(wsArcjet){
            try{
                const decision = await wsArcjet.protect(req)
                if(decision.isDenied()){
                    const code = decision.reason.isRateLimit()? 1013 : 1008
                    const reason = decision.reason.isRateLimit() ? 'Rate limit Exceeded': 'Access denied'
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
>>>>>>> 9b2afa17b777dc93e96755018a4a086a8cb21338

    function broadCastMatchCreated(match){
        broadCast(wss, {type:'match_created', data : match})
    }

<<<<<<< HEAD
    return {broadCastMatchCreated, matchBroadcast}
}




=======
    return {broadCastMatchCreated}
}


>>>>>>> 9b2afa17b777dc93e96755018a4a086a8cb21338
