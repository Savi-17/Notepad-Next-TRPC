import { router } from "./trpc";
import { notesRouter } from "./routers/notes";
import { authRouter } from "./routers/auth";

export const appRouter = router({
  auth: authRouter,
  notes: notesRouter,
});

export type AppRouter = typeof appRouter;
