import dotenv from 'dotenv'
dotenv.config()
import server from './src/index.js'

const port = process.env.PORT_ENV || 3000
const host = process.env.HOST || '0.0.0.0'
server.listen(port,host, () => {
    const baseUrl = host === '0.0.0.0' ? `http://localhost:${port}` : `http://${host}:${port}`
    console.log(`server is running on ${baseUrl}`)
    console.log(`WebSocket server is running on ${baseUrl.replace('http','ws')}/ws`)
})