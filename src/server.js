import http from "node:http";
import { json } from "./middlewares/json.js";
import { Database } from "./database.js";
import { randomUUID } from "node:crypto";

const database = new Database();
const SERVER_PORT = 3333;

const server = http.createServer(async (request, response) => {
  const { method, url } = request;

  await json(request, response);

  if (method === "GET" && url === "/users") {
    const users = database.select("users");

    return response.end(JSON.stringify(users));
  }

  if (method === "POST" && url === "/users") {
    const { name, email } = request.body;

    const user = {
      id: randomUUID(),
      name,
      email,
    };

    database.insert("users", user);

    return response.writeHead(201).end();
  }
});

server.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
});
