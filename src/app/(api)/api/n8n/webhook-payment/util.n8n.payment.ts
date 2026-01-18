import GetPrismaClient from "@/lib/prisma";
import { CategoryEnum } from "@prisma/client";

export async function getProductName(
  prisma: ReturnType<typeof GetPrismaClient>,
  category: CategoryEnum,
  item_id: number
) {
  if (category === CategoryEnum.COHORT) {
    const theCohortPrice = await prisma.cohortPrice.findFirst({
      select: { cohort: { select: { name: true } } },
      where: { id: item_id },
    });
    if (theCohortPrice) {
      return theCohortPrice.cohort.name;
    }
  }

  if (category === CategoryEnum.EVENT) {
    const theEventPrice = await prisma.eventPrice.findFirst({
      select: { event: { select: { name: true } } },
      where: { id: item_id },
    });
    if (theEventPrice) {
      return theEventPrice.event.name;
    }
  }

  if (category === CategoryEnum.PLAYLIST) {
    const thePlaylist = await prisma.playlist.findFirst({
      select: { name: true },
      where: { id: item_id },
    });
    if (thePlaylist) {
      return thePlaylist.name;
    }
  }

  return undefined;
}
