import {
  STATUS_CREATED,
  STATUS_FORBIDDEN,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_NO_CONTENT,
  STATUS_OK,
} from "@/lib/status_code";
import { administratorProcedure, loggedInProcedure } from "@/trpc/init";
import { checkDeleteResult, checkUpdateResult } from "@/trpc/utils/errors";
import {
  numberIsID,
  objectHasOnlyID,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { PrismaClient, StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";

async function isEnrolledTemplate(
  prisma: PrismaClient,
  user_id: string,
  error_message: string
) {
  const theEnrolledTemplate = await prisma.userTemplate.findFirst({
    where: {
      user_id: user_id,
    },
  });
  if (!theEnrolledTemplate) {
    throw new TRPCError({
      code: STATUS_FORBIDDEN,
      message: error_message,
    });
  }
}

// Read //

export const listTemplate = {
  templates: loggedInProcedure.query(async (opts) => {
    const whereClause = {
      status: undefined as StatusEnum | undefined,
    };
    if (opts.ctx.user.role.name === "General User") {
      await isEnrolledTemplate(
        opts.ctx.prisma,
        opts.ctx.user.id,
        "You're not allowed to view templates."
      );
      whereClause.status = StatusEnum.ACTIVE;
    }
    const templatesList = await opts.ctx.prisma.template.findMany({
      where: whereClause,
      orderBy: [{ created_at: "desc" }, { updated_at: "desc" }],
    });
    const returnedList = templatesList.map((entry) => {
      return {
        id: entry.id,
        name: entry.name,
        tags: entry.tags,
        image: entry.image,
        document_url: entry.document_url,
        status: entry.status,
      };
    });
    return {
      code: STATUS_OK,
      message: "Success",
      list: returnedList,
    };
  }),
};

export const readTemplate = {
  template: loggedInProcedure.input(objectHasOnlyID()).query(async (opts) => {
    const whereClause = {
      id: opts.input.id,
      status: undefined as StatusEnum | undefined,
    };
    if (opts.ctx.user.role.name === "General User") {
      await isEnrolledTemplate(
        opts.ctx.prisma,
        opts.ctx.user.id,
        "You're not allowed to view templates."
      );
      whereClause.status = StatusEnum.ACTIVE;
    }
    const theTemplate = await opts.ctx.prisma.template.findFirst({
      where: whereClause,
    });
    return {
      code: STATUS_OK,
      message: "Success",
      template: theTemplate,
    };
  }),
};

// Write //

export const createTemplate = {
  template: administratorProcedure
    .input(
      z.object({
        name: stringNotBlank(),
        description: stringNotBlank().nullable().optional(),
        image: stringNotBlank(),
        document_url: stringNotBlank(),
        status: z.enum(StatusEnum),
        tags: stringNotBlank().optional(),
      })
    )
    .mutation(async (opts) => {
      const createdTemplate = await opts.ctx.prisma.template.create({
        data: {
          name: opts.input.name,
          description: opts.input.description,
          image: opts.input.image,
          document_url: opts.input.document_url,
          status: opts.input.status,
          tags: opts.input.tags,
        },
      });
      const theTemplate = await opts.ctx.prisma.template.findFirst({
        where: { id: createdTemplate.id },
      });
      if (!theTemplate) {
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new template.",
        });
      }
      return {
        code: STATUS_CREATED,
        message: "Success",
        template: theTemplate,
      };
    }),
};

export const updateTemplate = {
  template: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        name: stringNotBlank().optional(),
        description: stringNotBlank().nullable().optional(),
        image: stringNotBlank().optional(),
        document_url: stringNotBlank().optional(),
        status: z.enum(StatusEnum).optional(),
        tags: stringNotBlank().optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedTemplate =
        await opts.ctx.prisma.template.updateManyAndReturn({
          data: {
            name: opts.input.name,
            description: opts.input.description,
            image: opts.input.image,
            document_url: opts.input.document_url,
            status: opts.input.status,
            tags: opts.input.tags,
          },
          where: {
            id: opts.input.id,
          },
        });
      checkUpdateResult(updatedTemplate.length, "template", "templates");
      return {
        code: STATUS_OK,
        message: "Success",
        template: updatedTemplate[0],
      };
    }),
};

export const deleteTemplate = {
  template: administratorProcedure
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      const deletedTemplate = await opts.ctx.prisma.template.deleteMany({
        where: {
          id: opts.input.id,
        },
      });
      checkDeleteResult(deletedTemplate.count, "templates", "template");
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),
};
