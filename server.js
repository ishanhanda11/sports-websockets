import dotenv from 'dotenv'
dotenv.config()



import app from './src/index.js'

const port = process.env.PORT_ENV || 3000

app.listen(port, () => {
    console.log(`server is running on ${port}`)
})