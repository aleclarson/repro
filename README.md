# repro/https-local-1

1. Prepare a clone of this branch.

  ```sh
  git clone https://github.com/aleclarson/repro -b https-local-1 https-local-1
  cd https-local-1
  yarn
  ```

2. Start the servers (an H2 server on port 44301, an H1 server on port 8001).

  ```sh
  yarn start
  ```

3. Send a `GET /` request to both servers using `node-fetch`.

  ```sh
  yarn test
  ```

4. Open `https://localhost:8001/index.html` to send a `GET /` request to
   the H1 server using native `fetch`.

  ```sh
  open https://localhost:8001/index.html
  ```

5. Open `https://localhost:44301/index.html` to send a `GET /` request to
   the H2 server using native `fetch`.
