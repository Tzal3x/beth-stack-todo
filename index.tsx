import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";

const app = new Elysia()
  .use(html())
  .get("/", () => (
    <BaseHtml>
      <body>
        <button hx-post="/clicked" hx-swap="outerHTML">
          Click me
        </button>
      </body>
    </BaseHtml>
  ))
  .post("/clicked", () => <div>I'm from the server!</div>)
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
      <script src="https://unpkg.com/htmx.org@1.9.3"></script>
    </head>
    ${children}
  `;
