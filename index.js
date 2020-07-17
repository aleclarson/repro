const http2 = require('http2')
const https = require('https')
const path = require('path')

const opts = require('https-local').options()

// Static file server for "app/index.html"
const st = require('st')({
  url: '/',
  path: path.resolve('app'),
})

// HTTP/1.1 server
const h1 = https
  .createServer(opts, (req, res) => {
    console.log('h1:req =>', req.url)
    if (req.url !== '/' && st(req, res)) return
    console.log('h1:hit')
    res.writeHead(204)
    res.end()
  })
  .listen(8001, () => {
    console.log('Listening at https://localhost:8001')
  })

// HTTP/2 server
const h2 = http2
  .createSecureServer(opts, (req, res) => {
    console.log('h2:req =>', req.url)
    if (req.url !== '/' && st(req, res)) return
    console.log('h2:hit')
    res.writeHead(204)
    res.end()
  })
  .on('session', session => {
    console.log('session:', session)
  })
  .listen(44301, () => {
    console.log('Listening at https://localhost:44301')
  })
