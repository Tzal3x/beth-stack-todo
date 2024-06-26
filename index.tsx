import { Elysia, t } from "elysia";
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
  .get("/todo", () => (
    <BaseHtml>
      <TodoList todos={db} />
    </BaseHtml>
  ))
  .post("/clicked", () => (
    <div class="flex h-screen w-full items-center justify-center bg-white text-blue-500">
      I'm from the server!
    </div>
  ))
  .post(
    "/todo/toggle/:id",
    ({ params }) => {
      const todo = db.find((todo) => todo.id === Number(params.id));
      if (todo) {
        todo.completed = !todo.completed;
        return <TodoItem {...todo} />;
      } else {
        console.log(`Todo with id ${params.id} not found`);
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    },
  )
  .post(
    "/todo",
    ({ body }) => {
      const newTodo = {
        id: lastID++,
        content: body.content,
        completed: false,
      };
      db.push(newTodo);
      return <TodoItem {...newTodo} />;
    },
    {
      body: t.Object({
        content: t.String(),
      }),
    },
  )
  .delete(
    "/todo/:id",
    ({ params }) => {
      const todo = db.find((todo) => todo.id === Number(params.id));
      if (!todo) {
        console.error(`Todo with id ${params.id} not found`);
        return;
      }
      db.splice(db.indexOf(todo), 1);
      // Not returning anything -> hx-delete will swap closest div with nothing,
      // Which is the same as deleting this todo item.
    },
    { params: t.Object({ id: t.Numeric() }) },
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
      <title>😺BETH TODO-APP</title>
      <script src="https://unpkg.com/htmx.org@1.9.3"></script>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    ${children}
  `;

const TodoItem = ({ content, completed, id }: Todo) => {
  return (
    <div class="flex flex-row space-x-3">
      <p>{content}</p>
      <input
        type="checkbox"
        checked={completed}
        hx-post={`/todo/toggle/${id}`}
        hx-trigger="change"
        hx-target="closest div"
        hx-swap="outerHTML"
      />
      <button
        class={"text-red-500"}
        hx-delete={`/todo/${id}`}
        hx-target="closest div"
        hx-swap="outerHTML"
      >
        X
      </button>
    </div>
  );
};

const TodoList = ({ todos }: { todos: Todo[] }) => {
  return (
    <div id="todo-list">
      {todos.map((todo) => (
        <TodoItem {...todo} />
      ))}
      <TodoForm />
    </div>
  );
};

const TodoForm = () => {
  return (
    <form hx-post="/todo" hx-swap="beforebegin">
      <input type="text" name="content" class={"border-2"} />
      <button type="submit" class={"rounded-lg bg-blue-500 p-1 text-white"}>
        Add
      </button>
    </form>
  );
};

type Todo = {
  id: number;
  content: string;
  completed: boolean;
};

let db: Todo[] = [
  { id: 1, content: "Learn about Bun", completed: false },
  { id: 2, content: "Learn HTMX", completed: false },
  { id: 3, content: "Integrate ElysiaJS", completed: false },
];

let lastID = db.length;
