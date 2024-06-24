import { PrismaClient } from "@prisma/client";
import { Elysia } from "elysia";

interface Post {
  id?: number;
  title: string;
  path: string;
  content: string;
}

const prisma = new PrismaClient({
  log: ["info", "warn", "error"],
});

const app = new Elysia().decorate("db", prisma);

app.get("/posts", ({ db }) => {
  return db.post.findMany();
});

app.post("/posts", ({ db, body }) => {
  return db.post.create({
    data: body as Post,
  });
});

app.get("/posts/:id", ({ db, params }) => {
  return db.post.findUnique({
    where: { id: Number(params.id) },
  });
});

app.get("/posts/slug/:slug", ({ db, params }) => {
  return db.post.findUnique({
    where: { path: params.slug },
  });
});

app.put("/posts/:id", ({ db, params, body }) => {
  return db.post.update({
    where: { id: Number(params.id) },
    data: body as Post,
  });
});

app.delete("/posts/:id", ({ db, params }) => {
  return db.post.delete({
    where: { id: Number(params.id) },
  });
});

app.listen(process.env.APP_PORT || 3000, () => {
  console.log(`Server is running on port ${app.server?.port}`);
});
