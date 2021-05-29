import mqtt from 'mqtt'

const client = mqtt.connect('mqtt://mqtt.netpie.io', {
  clientId: process.env.MQTT_CLIENT_ID,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
})

export function initMqtt(callback: () => void) {
  client.on('connect', () => {
    client.subscribe('@msg/devicetofrontend')
    console.log('MQTT connected!')
    callback()
  })

  client.on('message', (topic, message) => {
    callback()
  })
}
