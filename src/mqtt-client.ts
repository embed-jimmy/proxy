import mqtt from 'mqtt'

export function initMqtt(callback: () => void) {
  const client = mqtt.connect('mqtt://mqtt.netpie.io', {
    clientId: process.env.MQTT_CLIENT_ID,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  })

  console.log('connecting MQTT')
  client.on('connect', () => {
    client.subscribe('@msg/devicetofrontend')
    console.log('MQTT connected!')
    callback()
  })

  client.on('message', (topic, message) => {
    callback()
  })
}
