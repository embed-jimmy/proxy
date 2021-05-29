import { initMqtt } from './mqtt-client'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { getDeviceData, updateDeviceData } from './http-client'
import pMemoize from 'p-memoize'
import cors from 'cors'
import { json } from 'body-parser'

const getData = pMemoize(getDeviceData, { maxAge: 60000 })

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

app.set('trust proxy', true)
app.use(cors())
app.use(json())

app.get('/', async (_, res) => {
  res.json(await getData())
})

app.put('/updateDevice', async (req, res) => {
  try {
    await updateDeviceData(req.body)
    await onDeviceUpdated()
    res.json({ result: 'OK' })
  } catch (error) {
    if (error.isAxiosError) {
      const {
        response: { status, data },
      } = error
      res.status(status).send(data)
    }
  }
})

const port = process.env.PORT
server.listen(port, () => {
  console.log(`listening on *:${port}`)
})

initMqtt(onDeviceUpdated)

async function onDeviceUpdated() {
  console.log('device data updated, broadcasting')
  pMemoize.clear(getData)
  await broadcastDeviceData()
}

async function broadcastDeviceData() {
  io.send('data', await getData())
}
