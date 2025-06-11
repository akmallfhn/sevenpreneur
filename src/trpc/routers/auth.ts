import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { GoogleOAuthVerifier } from "@/trpc/utils/google_oauth";
import { stringNotBlank } from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";
import { z } from "zod";

export const authRouter = createTRPCRouter({
  login: baseProcedure
    .input(
      z.object({
        credential: stringNotBlank(),
      })
    )
    .mutation(async (opts) => {
      const credUser = await GoogleOAuthVerifier(opts.input.credential);
      if (!credUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The given credential is not valid.",
        });
      }

      const findUser = await opts.ctx.prisma.user.findUnique({
        where: {
          email: credUser.email,
        },
      });
      let registeredUser = findUser;

      if (!findUser) {
        const createdUser = await opts.ctx.prisma.user.create({
          data: {
            full_name: credUser.name,
            email: credUser.email,
            avatar: credUser.picture,
          },
        });
        registeredUser = createdUser;
      } else if (findUser.status === StatusEnum.INACTIVE) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Your account has been inactivated.",
        });
      } else {
        const updatedLogin: number = await opts.ctx.prisma
          .$executeRaw`UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = ${credUser.email};`;
        if (updatedLogin > 1) {
          console.error(
            "auth.login: More-than-one users have its last_login updated at once."
          );
        }
      }
      // registeredUser should be not null

      const generatedToken = randomBytes(64).toString("hex");
      const createdToken = await opts.ctx.prisma.token.create({
        data: {
          user_id: registeredUser!.id,
          is_active: true,
          token: generatedToken,
        },
      });

      return {
        message: "Success",
        token: createdToken,
        registered_user: registeredUser,
      };
    }),
  logout: baseProcedure
    .input(
      z.object({
        token: stringNotBlank(),
      })
    )
    .mutation(async (opts) => {
      const deletedTokens = await opts.ctx.prisma.token.deleteMany({
        where: {
          token: opts.input.token,
        },
      });
      if (deletedTokens.count > 1) {
        console.error("auth.logout: More-than-one tokens are removed at once.");
      }

      return {
        message: "Success",
      };
    }),
});
