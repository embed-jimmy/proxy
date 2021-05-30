import axios from 'axios'

const client = axios.create({
  baseURL: 'https://api.netpie.io/v2/device',
  headers: {
    Authorization: process.env.API_KEY,
  },
})

export async function getDeviceData() {
  const response = await client.get('/shadow/data')
  const netpieData = response.data
  return netpieData.data
}

export async function updateDeviceData(updatedData: any) {
  await client.put('/shadow/data', {
    data: updatedData,
  })
  await client.put('/message/frontendtodevice')
}
