import express from 'express'

import matchRouter from './routes/matches.route.js'

const app = express()

app.use(express.json())
app.use('/matches',matchRouter)
export default app