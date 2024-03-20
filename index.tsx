import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";

const app = new Elysia()
  .use(html())
  .get("/", () => (
    <BaseHtml>
      <body>
        <button
          hx-post="/clicked"
          hx-swap="outerHTML"
          class="flex h-screen w-full items-center justify-center bg-blue-500 text-white"
        >
          Click me
        </button>
      </body>
    </BaseHtml>
  ))
  .post("/clicked", () => (
    <div class="flex h-screen w-full items-center justify-center bg-white text-blue-500">
      I'm from the server!
    </div>
  ))
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
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    ${children}
  `;
