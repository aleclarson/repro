## How to reproduce

```sh
# 0. Install pnpm package manager
curl -fsSL https://get.pnpm.io/install.sh | PNPM_VERSION=7.0.0-rc.3 sh -

# 1. Clone this branch
git clone https://github.com/aleclarson/repro -b dolt-4-15-2022

# 2. Run the prepare script
pnpm prepare

# 3. Start the server in one tab
pnpm serve:db

# 4. Run the test script in another tab
pnpm test
```

## Example output

```
❯ pnpm test

> repro@1.0.0 test /repro
> node test.js

/repro/node_modules/.pnpm/mysql2@2.3.3/node_modules/mysql2/lib/packets/packet.js:728
    const err = new Error(message);
                ^

Error: insert into `test` (`foo`, `id`) values ('[1,2,3]', 1) on duplicate key update `foo` = values(`foo`), `id` = values(`id`) - context canceled
    at Packet.asError (/repro/node_modules/.pnpm/mysql2@2.3.3/node_modules/mysql2/lib/packets/packet.js:728:17)
    at Query.execute (/repro/node_modules/.pnpm/mysql2@2.3.3/node_modules/mysql2/lib/commands/command.js:29:26)
    at Connection.handlePacket (/repro/node_modules/.pnpm/mysql2@2.3.3/node_modules/mysql2/lib/connection.js:456:32)
    at PacketParser.onPacket (/repro/node_modules/.pnpm/mysql2@2.3.3/node_modules/mysql2/lib/connection.js:85:12)
    at PacketParser.executeStart (/repro/node_modules/.pnpm/mysql2@2.3.3/node_modules/mysql2/lib/packet_parser.js:75:16)
    at Socket.<anonymous> (/repro/node_modules/.pnpm/mysql2@2.3.3/node_modules/mysql2/lib/connection.js:92:25)
    at Socket.emit (node:events:390:28)
    at addChunk (node:internal/streams/readable:324:12)
    at readableAddChunk (node:internal/streams/readable:297:9)
    at Socket.Readable.push (node:internal/streams/readable:234:10) {
  code: 'ER_UNKNOWN_ERROR',
  errno: 1105,
  sqlState: 'HY000',
  sqlMessage: 'context canceled',
  sql: "insert into `test` (`foo`, `id`) values ('[1,2,3]', 1) on duplicate key update `foo` = values(`foo`), `id` = values(`id`)"
}

Node.js v17.2.0
 ELIFECYCLE  Test failed. See above for more details.
```
