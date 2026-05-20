import express from 'express'
import http from 'http'
import matchRouter from './routes/matches.route.js'
import { attachWebSocketServer } from './ws/server.js'

const app = express()
const server = http.createServer(app)
app.use(express.json())
app.use('/matches',matchRouter)
const {broadCastMatchCreated} = attachWebSocketServer(server)

app.locals.broadCastMatchCreated = broadCastMatchCreated;
export default server