import {
  STATUS_BAD_REQUEST,
  STATUS_FORBIDDEN,
  STATUS_NO_CONTENT,
  STATUS_OK,
} from "@/lib/status_code";
import {
  createTRPCRouter,
  loggedInProcedure,
  publicProcedure,
} from "@/trpc/init";
import { GoogleTokenVerifier } from "@/trpc/utils/google_verifier";
import { stringNotBlank } from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";
import { z } from "zod";

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        accessToken: stringNotBlank(),
      })
    )
    .mutation(async (opts) => {
      const userInfo = await GoogleTokenVerifier(opts.input.accessToken);
      if (!userInfo) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: "The given credential is not valid.",
        });
      }

      const findUser = await opts.ctx.prisma.user.findUnique({
        where: {
          email: userInfo.email,
        },
      });
      let registeredUser = findUser;

      if (!findUser) {
        const createdUser = await opts.ctx.prisma.user.create({
          data: {
            full_name: userInfo.name,
            email: userInfo.email,
            avatar: userInfo.picture,
          },
        });
        registeredUser = createdUser;
      } else if (findUser.status === StatusEnum.INACTIVE) {
        throw new TRPCError({
          code: STATUS_FORBIDDEN,
          message: "Your account has been inactivated.",
        });
      } else if (findUser.deleted_at !== null) {
        throw new TRPCError({
          code: STATUS_FORBIDDEN,
          message: `Your account has been deleted (${findUser.deleted_at}).`,
        });
      } else {
        if (!findUser.avatar && userInfo.picture) {
          const updatedAvatar = await opts.ctx.prisma.user.updateManyAndReturn({
            data: {
              avatar: userInfo.picture,
            },
            where: {
              email: userInfo.email,
            },
          });
          if (updatedAvatar.length > 1) {
            console.error(
              "auth.login: More-than-one users have its avatar updated at once."
            );
          }
        }

        // $executeRaw is used for using the correct CURRENT_TIMESTAMP.
        const updatedLogin: number = await opts.ctx.prisma
          .$executeRaw`UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = ${userInfo.email};`;
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
        code: STATUS_OK,
        message: "Success",
        token: createdToken,
        registered_user: registeredUser,
      };
    }),

  checkSession: loggedInProcedure.query((opts) => {
    const theUser = opts.ctx.user;
    return {
      code: STATUS_OK,
      message: "Success",
      user: {
        id: theUser.id,
        full_name: theUser.full_name,
        email: theUser.email,
        phone_country_id: theUser.phone_country_id,
        phone_number: theUser.phone_number,
        avatar: theUser.avatar,
        role_id: theUser.role_id,
        role_name: theUser.role.name,
        status: theUser.status,
      },
    };
  }),

  logout: publicProcedure
    .input(
      z.object({
        token: stringNotBlank(),
      })
    )
    .mutation(async (opts) => {
      const inactivatedTokens = await opts.ctx.prisma.token.updateMany({
        data: {
          is_active: false,
        },
        where: {
          token: opts.input.token,
        },
      });
      if (inactivatedTokens.count > 1) {
        console.error(
          "auth.logout: More-than-one tokens are inactivated at once."
        );
      }

      return {
        code: STATUS_NO_CONTENT,
        message: "Successfully logged out",
      };
    }),
});
