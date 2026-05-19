import express from 'express'
import prisma from './db/db'

const app = express()

app.use(express.json())

export default app