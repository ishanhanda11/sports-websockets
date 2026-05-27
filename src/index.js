import express from 'express'
import http from 'http'
import matchRouter from './routes/matches.route.js'
import { attachWebSocketServer } from './ws/server.js'

import  commentaryRouter  from './routes/commentary.route.js'

const app = express()
const server = http.createServer(app)
app.use(express.json())

app.use('/matches',matchRouter)
app.use('/matches/:id/commentary', commentaryRouter)
const {broadCastMatchCreated, matchBroadcast} = attachWebSocketServer(server)

app.locals.broadCastMatchCreated = broadCastMatchCreated;
export default server