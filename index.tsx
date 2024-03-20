import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";

const app = new Elysia()
  .use(html())
  .get("/", ({ html }) =>
    html(
      <BaseHtml>
        <h1>Hello, world!</h1>
      </BaseHtml>,
    ),
  )
  .listen(3000);

console.log(
  `🦊 Server is running on http://${app.server?.hostname}:${app.server?.port}`,
);

const BaseHtml = ({ children }: any) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>The BETH stack</title>
    </head>
    ${children}
  `;
