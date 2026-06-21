import { once } from "node:events"
import { createServer } from "node:http"

const cleanupTimeoutMs = 150

type Method = "GET" | "POST"

const events: string[] = []

const server = createServer(async (request, response) => {
  const method = request.method as Method
  events.push(`${method} handler`)

  request.socket.on("close", () => {
    events.push(`${method} socket-close`)
  })
  response.on("close", () => {
    events.push(`${method} response-close`)
  })

  if (method === "POST") {
    for await (const _chunk of request) {
      // Drain the request body before sending the streaming response.
    }
    events.push("POST body-read")
  }

  response.writeHead(200, {
    "content-type": "application/octet-stream",
  })
  response.flushHeaders()
  events.push(`${method} headers-flushed`)
})

server.listen(0, "127.0.0.1")
await once(server, "listening")

const address = server.address()
if (!address || typeof address === "string") {
  throw new Error("Server did not bind to a TCP port")
}

async function run(method: Method) {
  const abortController = new AbortController()
  const response = await fetch(`http://127.0.0.1:${address.port}/stream`, {
    method,
    body: method === "POST" ? "{}" : undefined,
    headers: method === "POST" ? { "content-type": "application/json" } : undefined,
    signal: abortController.signal,
  })
  events.push(`${method} response`)

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error(`${method} response did not have a body`)
  }

  const read = reader
    .read()
    .then((value) => {
      events.push(`${method} read:${JSON.stringify(value)}`)
    })
    .catch((error: Error) => {
      events.push(`${method} read-error:${error.name}:${error.message}`)
    })

  await sleep(25)
  abortController.abort()

  await Promise.race([
    read,
    sleep(cleanupTimeoutMs).then(() => {
      events.push(`${method} read-timeout`)
    }),
  ])
  await sleep(cleanupTimeoutMs)
}

await run("GET")
await run("POST")

server.close()

const getClosed = events.includes("GET socket-close") || events.includes("GET response-close")
const postClosed = events.includes("POST socket-close") || events.includes("POST response-close")

console.log(events.join("\n"))

if (!getClosed) {
  console.error("\nExpected GET abort to close the server-side request.")
  process.exitCode = 1
} else if (!postClosed) {
  console.error("\nReproduced: POST abort did not close the server-side request.")
  process.exitCode = 1
} else {
  console.log("\nNo reproduction: both GET and POST closed server-side.")
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}
