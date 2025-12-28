import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { connectDB } from "../../../server/db/mongo";
import { Note } from "../../../server/db/note.model";

export const notesRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    await connectDB();

    return Note.find({ userId: ctx.user!.userId })
      .sort({ createdAt: -1 })
      .lean();
  }),

  add: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await connectDB();

      return Note.create({
        text: input.text,
        userId: ctx.user!.userId,
      });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), text: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await connectDB();

      return Note.findOneAndUpdate(
        { _id: input.id, userId: ctx.user!.userId },
        { text: input.text },
        { new: true }
      );
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await connectDB();

      return Note.findOneAndDelete({
        _id: input.id,
        userId: ctx.user!.userId,
      });
    }),
});
