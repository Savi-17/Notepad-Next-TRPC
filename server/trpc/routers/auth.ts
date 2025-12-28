import { z } from "zod";
import bcrypt from "bcryptjs";
import { router, publicProcedure } from "../trpc";
import { User } from "../../db/user.model";
import { signToken } from "../../auth";

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const exists = await User.findOne({ email: input.email });
      if (exists) throw new Error("User exists");

      const hashed = await bcrypt.hash(input.password, 10);
      const user = await User.create({ email: input.email, password: hashed });

      return { token: signToken(user._id.toString()) };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await User.findOne({ email: input.email });
      if (!user) throw new Error("Invalid credentials");

      const ok = await bcrypt.compare(input.password, user.password);
      if (!ok) throw new Error("Invalid credentials");

      return { token: signToken(user._id.toString()) };
    }),
});
