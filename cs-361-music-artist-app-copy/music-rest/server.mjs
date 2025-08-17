import express from "express";
import 'dotenv/config'
import cors from "cors";
import router from './music-controller.mjs'
import {connect} from './music-model.mjs'

const PORT = process.env.PORT || 3000


const app = express()
app.use(cors())
app.use(express.json({ limit: '5mb' }))


app.use('/api', router)

app.use((err, req, res, next) => { 
    console.error(err)
    res.status(500).json({Error: 'Internal Server Error'})
})


app.listen(PORT,  async () => {
    await connect()
    console.log(`Server running on port ${PORT}`)
})