import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello world!").listen(3000);

console.log(
  `🦊 Server is running on http://${app.server?.hostname}:${app.server?.port}`,
);
