const fetchPath = require.resolve(process.env.FETCH || 'node-fetch')
console.log('Fetch path: %O', fetchPath)
const fetch = require(fetchPath)

async function test(url) {
  console.log('\nTesting: %O', url)
  try {
    const res = await fetch(url)
    console.log(res.status + ' ' + res.statusText)
  } catch(e) {
    console.error(e)
  }
}

test('https://localhost:44301')
.then(() => test('https://localhost:8001'))
