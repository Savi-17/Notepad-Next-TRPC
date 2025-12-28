import { inferAsyncReturnType } from "@trpc/server";
import { headers } from "next/headers";
import { verifyToken } from "../auth";
import { connectDB } from "../db/mongo";

export async function createContext() {
  await connectDB();

  const authHeader = (await headers()).get("authorization");
  let user = null;

  if (authHeader?.startsWith("Bearer ")) {
    try {
      user = verifyToken(authHeader.split(" ")[1]);
    } catch {}
  }

  return { user };
}

export type Context = inferAsyncReturnType<typeof createContext>;
