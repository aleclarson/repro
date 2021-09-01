import got from 'got'

export async function test() {
  const res = await got('http://localhost:3000')
  return [
    res.headers,
    res.body,
  ]
}
