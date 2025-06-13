<<<<<<< HEAD
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { GoogleOAuthVerifier } from "@/trpc/utils/google_oauth";
=======
import {
  baseProcedure,
  createTRPCRouter,
  loggedInProcedure,
} from "@/trpc/init";
import { GoogleTokenVerifier } from "@/trpc/utils/google_verifier";
>>>>>>> main
import { stringNotBlank } from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { randomBytes } from "crypto";
import { z } from "zod";

export const authRouter = createTRPCRouter({
  // --- ENDPOINT FOR LOGIN
  login: baseProcedure
    .input(
      z.object({
        accessToken: stringNotBlank(),
      })
    )
    // --- Procedure for edit data
    .mutation(async (opts) => {
<<<<<<< HEAD
      // --- Checking access token
      const userInfo = await GoogleOAuthVerifier(opts.input.accessToken);
=======
      const userInfo = await GoogleTokenVerifier(opts.input.accessToken);
>>>>>>> main
      if (!userInfo) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The given credential is not valid.",
        });
      }

      // --- Find user in database by email
      const findUser = await opts.ctx.prisma.user.findUnique({
        where: {
          email: userInfo.email,
        },
      });
      // --- Temporary save user result
      let registeredUser = findUser;

      // --- If user not found -> create new
      if (!findUser) {
        const createdUser = await opts.ctx.prisma.user.create({
          data: {
            full_name: userInfo.name,
            email: userInfo.email,
            avatar: userInfo.picture,
          },
        });
        registeredUser = createdUser;

        // --- If user inactive -> reject
      } else if (findUser.status === StatusEnum.INACTIVE) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Your account has been inactivated.",
        });
      } else {
<<<<<<< HEAD
        // --- Update avatar if field is null
        if (!findUser.avatar && userInfo.picture) {
          await opts.ctx.prisma.user.update({
            where: { email: userInfo.email },
            data: { avatar: userInfo.picture },
          });
        }

        // --- If user available -> update last login
=======
        if (!findUser.avatar && userInfo.picture) {
          // $executeRaw is used for counting updated avatars.
          const updatedAvatar: number = await opts.ctx.prisma
            .$executeRaw`UPDATE users SET avatar = ${userInfo.picture} WHERE email = ${userInfo.email};`;
          if (updatedAvatar > 1) {
            console.error(
              "auth.login: More-than-one users have its avatar updated at once."
            );
          }
        }

        // $executeRaw is used for counting updated last_logins.
>>>>>>> main
        const updatedLogin: number = await opts.ctx.prisma
          .$executeRaw`UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = ${userInfo.email};`;
        if (updatedLogin > 1) {
          console.error(
            "auth.login: More-than-one users have its last_login updated at once."
          );
        }
      }

<<<<<<< HEAD
      // --- Generate random token using crypto
      const generatedToken = randomBytes(64).toString("hex");
      // --- Save token in table token
=======
      const generatedToken = randomBytes(64).toString("hex");
>>>>>>> main
      const createdToken = await opts.ctx.prisma.token.create({
        data: {
          user_id: registeredUser!.id,
          is_active: true,
          token: generatedToken,
        },
      });

      // --- Return success response
      return {
        message: "Success",
        token: createdToken,
        registered_user: registeredUser,
      };
    }),

<<<<<<< HEAD
  // --- ENDPOINT FOR LOGOUT
=======
  checkSession: loggedInProcedure.query((opts) => {
    const theUser = opts.ctx.user;
    return {
      message: "Success",
      user: {
        id: theUser.id,
        full_name: theUser.full_name,
        email: theUser.email,
        avatar: theUser.avatar,
        role_id: theUser.role_id,
        role_name: theUser.role.name,
        status: theUser.status,
      },
    };
  }),

>>>>>>> main
  logout: baseProcedure
    .input(
      z.object({
        token: stringNotBlank(),
      })
    )
    // --- Delete all session token from user
    .mutation(async (opts) => {
      const deletedTokens = await opts.ctx.prisma.token.deleteMany({
        where: {
          token: opts.input.token,
        },
      });
      if (deletedTokens.count > 1) {
        console.error("auth.logout: More-than-one tokens are removed at once.");
      }

      // --- Return success response
      return {
        code: "SUCCESS",
        message: "Successfully logout",
      };
    }),
});
