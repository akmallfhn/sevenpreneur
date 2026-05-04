import { Prisma, PrismaClient, StatusEnum } from "@/generated/prisma/client";

export async function calculateBAScore(
  prisma: PrismaClient,
  answers: { question_id: number; score: number }[]
) {
  const answerByID = {} as { [key: number]: number };
  answers.forEach((entry) => {
    answerByID[entry.question_id] = entry.score;
  });

  const allCategories = await prisma.bACategory.findMany({
    select: {
      weight: true,
      subcategories: {
        select: {
          questions: {
            select: {
              id: true,
              weight: true,
            },
            where: {
              status: StatusEnum.ACTIVE,
            },
          },
        },
      },
    },
  });
  const totalScore = allCategories
    .reduce((prev, category) => {
      const totalWeight = category.subcategories.reduce(
        (prev, subcategory) =>
          prev.add(
            subcategory.questions.reduce(
              (prev, question) => prev.add(question.weight),
              new Prisma.Decimal(0)
            )
          ),
        new Prisma.Decimal(0)
      );
      const totalWeightedScore = category.subcategories.reduce(
        (prev, subcategory) =>
          prev.add(
            subcategory.questions.reduce((prev, question) => {
              const weightedScore = question.weight.mul(
                answerByID[question.id]
              );
              return prev.add(weightedScore);
            }, new Prisma.Decimal(0))
          ),
        new Prisma.Decimal(0)
      );
      return prev.add(
        totalWeightedScore.dividedBy(totalWeight).mul(category.weight.div(100)) // Category weight is in percent (%).
      );
    }, new Prisma.Decimal(0))
    .div(5) // Score is in [0, 5] range.
    .mul(100); // Answer sheet score is in percent (%).

  return totalScore;
}
