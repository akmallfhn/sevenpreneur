import { createTRPCRouter } from "@/trpc/init";
import { championAilene } from "./champion.ailene";
import { listAilene } from "./list.ailene";
import { updateAilene } from "./update.ailene";

export const aileneRouter = createTRPCRouter({
  list: createTRPCRouter({
    myGroups: listAilene.myGroups,
    levels: listAilene.levels,
    chapters: listAilene.chapters,
    tasks: listAilene.tasks,
    quizQuestions: listAilene.quizQuestions,
  }),
  champion: createTRPCRouter({
    listGroups: championAilene.listGroups,
    listMembers: championAilene.listMembers,
  }),
  unlockLevel: updateAilene.unlockLevel,
  submitQuiz: updateAilene.submitQuiz,
});
